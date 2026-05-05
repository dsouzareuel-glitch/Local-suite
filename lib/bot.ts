import { createServiceClient } from "./supabase";
import { sendWhatsAppMessage, parseWebhookMessage } from "./whatsapp";
import { getAvailableSlots } from "./booking";
import { createCalendarEvent } from "./calendar";
import { format, parseISO, addDays } from "date-fns";

export async function handleWhatsAppMessage(payload: any) {
  const message = parseWebhookMessage(payload);
  if (!message) {
    console.log("⚠️ Bot: Could not parse webhook message.");
    return;
  }

  const { from, text, phoneNumberId, customerName: profileName } = message;
  console.log(`📩 Bot: Incoming message from ${from} (Phone ID: ${phoneNumberId})`);
  
  const supabase = createServiceClient();

  // 1. Identify the business by phoneNumberId
  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("*")
    .eq("phone_number_id", phoneNumberId)
    .single();

  if (bizError || !business) {
    console.log(`❌ Bot: No business found for Phone ID: ${phoneNumberId}`);
    return;
  }

  console.log(`✅ Bot: Found business: ${business.name} (ID: ${business.id})`);

  // 2. Get or create session
  let { data: session } = await supabase
    .from("whatsapp_sessions")
    .select("*")
    .eq("business_id", business.id)
    .eq("customer_phone", from)
    .single();

  if (!session) {
    console.log(`🆕 Bot: Creating new session for ${from}`);
    const { data: newSession, error: createError } = await supabase
      .from("whatsapp_sessions")
      .insert({
        business_id: business.id,
        customer_phone: from,
        state: "IDLE"
      })
      .select()
      .single();
    
    if (createError) {
      console.log(`❌ Bot: Failed to create session: ${createError.message}`);
      return;
    }
    session = newSession;
  } else {
    console.log(`📂 Bot: Found existing session (State: ${session.state})`);
  }

  // 3. State Machine Logic
  switch (session.state) {
    case "IDLE":
      await handleIdle(supabase, business, session, text);
      break;
    case "SELECTING_DATE":
      await handleDateSelection(supabase, business, session, text);
      break;
    case "SELECTING_TIME":
      await handleTimeSelection(supabase, business, session, text);
      break;
    case "CONFIRMING":
      await handleConfirmation(supabase, business, session, text);
      break;
    default:
      await resetSession(supabase, session);
  }
}

async function handleIdle(supabase: any, business: any, session: any, text: string) {
  // Logic: If user wants to book, show next 7 available dates
  const isBookingIntent = /book|appointment|slot|appointment|hi|hello|hey/i.test(text);

  if (isBookingIntent) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(new Date(), i);
      dates.push({
        label: format(d, "EEEE, MMM do"),
        value: format(d, "yyyy-MM-dd")
      });
    }

    let msg = `Hi! 👋 Welcome to *${business.name}*.\n\nWhen would you like to visit? Please reply with the number:\n\n`;
    dates.forEach((d, i) => {
      msg += `${i + 1}. ${d.label}\n`;
    });

    await sendWhatsAppMessage({
      to: session.customer_phone,
      message: msg,
      phoneNumberId: business.phone_number_id,
      token: business.whatsapp_token
    });

    await supabase
      .from("whatsapp_sessions")
      .update({ state: "SELECTING_DATE" })
      .eq("id", session.id);
  } else {
    // Other intents (pricing, address) can be handled here or by AI
    await sendWhatsAppMessage({
      to: session.customer_phone,
      message: "How can I help you today? You can ask about our *prices*, *location*, or type *BOOK* to schedule an appointment. 😊",
      phoneNumberId: business.phone_number_id,
      token: business.whatsapp_token
    });
  }
}

async function handleDateSelection(supabase: any, business: any, session: any, text: string) {
  const choice = parseInt(text.trim());
  if (isNaN(choice) || choice < 1 || choice > 7) {
    await sendWhatsAppMessage({
      to: session.customer_phone,
      message: "Please choose a valid number (1-7) for the date. 🙏",
      phoneNumberId: business.phone_number_id,
      token: business.whatsapp_token
    });
    return;
  }

  const selectedDate = format(addDays(new Date(), choice - 1), "yyyy-MM-dd");
  const slots = await getAvailableSlots(business.id, selectedDate);

  if (slots.length === 0) {
    await sendWhatsAppMessage({
      to: session.customer_phone,
      message: "Sorry, we are fully booked or closed on that day. Please pick another date! 📅",
      phoneNumberId: business.phone_number_id,
      token: business.whatsapp_token
    });
    await resetToDateSelection(supabase, session);
    return;
  }

  let msg = `Great! Here are the available slots for *${format(parseISO(selectedDate), "MMM do")}*:\n\n`;
  slots.forEach((s, i) => {
    msg += `${i + 1}. ${s.label}${s.available ? "" : " (~~Booked~~)"}\n`;
  });
  msg += `\nReply with the slot number.`;

  await sendWhatsAppMessage({
    to: session.customer_phone,
    message: msg,
    phoneNumberId: business.phone_number_id,
    token: business.whatsapp_token
  });

  await supabase
    .from("whatsapp_sessions")
    .update({ 
      state: "SELECTING_TIME", 
      selected_date: selectedDate 
    })
    .eq("id", session.id);
}

async function handleTimeSelection(supabase: any, business: any, session: any, text: string) {
  const slots = await getAvailableSlots(business.id, session.selected_date);
  const choice = parseInt(text.trim());

  if (isNaN(choice) || choice < 1 || choice > slots.length || !slots[choice - 1].available) {
    await sendWhatsAppMessage({
      to: session.customer_phone,
      message: "Invalid selection. Please choose an available slot number. 🙏",
      phoneNumberId: business.phone_number_id,
      token: business.whatsapp_token
    });
    return;
  }

  const selectedTime = slots[choice - 1].time;

  await sendWhatsAppMessage({
    to: session.customer_phone,
    message: "Almost there! What is your *full name* for the booking? ✍️",
    phoneNumberId: business.phone_number_id,
    token: business.whatsapp_token
  });

  await supabase
    .from("whatsapp_sessions")
    .update({ 
      state: "CONFIRMING", 
      selected_time: selectedTime 
    })
    .eq("id", session.id);
}

async function handleConfirmation(supabase: any, business: any, session: any, text: string) {
  const customerName = text.trim();
  const startTime = parseISO(session.selected_time);
  const endTime = addDays(startTime, 0); // Need to calculate based on service duration
  // Actually, we should get the duration from business settings.

  // 1. Create appointment in DB
  const { data: appointment, error: apptError } = await supabase
    .from("appointments")
    .insert({
      business_id: business.id,
      customer_name: customerName,
      customer_phone: session.customer_phone,
      customer_wa_id: session.customer_phone,
      start_time: session.selected_time,
      status: "confirmed"
    })
    .select()
    .single();

  if (apptError) throw apptError;

  // 2. Sync to Google Calendar if connected
  if (business.google_refresh_token) {
    try {
      await createCalendarEvent(business.google_refresh_token, {
        summary: `Booking: ${customerName} (${business.name})`,
        description: `WhatsApp Booking via LocalSuite\nCustomer: ${customerName}\nPhone: ${session.customer_phone}`,
        startTime: startTime,
        endTime: addDays(startTime, 0.02) // Roughly 30 mins
      });
    } catch (e) {
      console.error("Failed to sync to Google Calendar:", e);
    }
  }

  // 3. Final Confirmation
  const msg = `✅ *Booking Confirmed!*\n\n*Service:* Appointment\n*Time:* ${format(startTime, "EEEE, MMM do 'at' hh:mm a")}\n*Name:* ${customerName}\n\nWe look forward to seeing you! 🙏`;
  
  await sendWhatsAppMessage({
    to: session.customer_phone,
    message: msg,
    phoneNumberId: business.phone_number_id,
    token: business.whatsapp_token
  });

  await resetSession(supabase, session);
}

async function resetSession(supabase: any, session: any) {
  await supabase
    .from("whatsapp_sessions")
    .delete()
    .eq("id", session.id);
}

async function resetToDateSelection(supabase: any, session: any) {
  await supabase
    .from("whatsapp_sessions")
    .update({ state: "IDLE" })
    .eq("id", session.id);
}
