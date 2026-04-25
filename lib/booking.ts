import { createServiceClient } from "./supabase";
import { getFreeBusy } from "./calendar";
import { addMinutes, format, isAfter, isBefore, parseISO, startOfDay, endOfDay, setHours, setMinutes } from "date-fns";

export async function getAvailableSlots(businessId: string, dateStr: string) {
  const supabase = createServiceClient();
  const date = parseISO(dateStr);
  const dayOfWeek = date.getDay();

  // 1. Get business rules & calendar token
  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("*, availability_rules(*)")
    .eq("id", businessId)
    .single();

  if (bizError || !business) throw new Error("Business not found");

  const rules = business.availability_rules.find((r: any) => r.day_of_week === dayOfWeek && r.is_active);
  if (!rules) return []; // Closed

  // 2. Get blocked slots from DB (Google + existing local bookings)
  const { data: blocked, error: blockError } = await supabase
    .from("blocked_slots")
    .select("start_time, end_time")
    .eq("business_id", businessId)
    .gte("start_time", startOfDay(date).toISOString())
    .lte("end_time", endOfDay(date).toISOString());

  // 3. Generate all possible slots based on duration
  const slots = [];
  const [startH, startM] = rules.start_time.split(":").map(Number);
  const [endH, endM] = rules.end_time.split(":").map(Number);
  
  let current = setMinutes(setHours(date, startH), startM);
  const end = setMinutes(setHours(date, endH), endM);
  const duration = business.slot_duration_minutes || 30;

  while (isBefore(current, end)) {
    const slotEnd = addMinutes(current, duration);
    
    // Check if current slot overlaps with any blocked slot
    const isBlocked = blocked?.some(b => {
      const bStart = parseISO(b.start_time);
      const bEnd = parseISO(b.end_time);
      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      return isBefore(current, bEnd) && isAfter(slotEnd, bStart);
    });

    // Check if slot is in the past
    const isPast = isBefore(current, new Date());

    slots.push({
      time: current.toISOString(),
      label: format(current, "hh:mm a"),
      available: !isBlocked && !isPast
    });

    current = slotEnd;
  }

  return slots;
}
