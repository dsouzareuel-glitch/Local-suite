// WhatsApp Cloud API helper
const WA_API_VERSION = "v19.0";
const BASE_URL = "https://graph.facebook.com";

export async function sendWhatsAppMessage(params: {
  to: string;
  message: string;
  phoneNumberId: string;
  token: string;
}) {
  const url = `${BASE_URL}/${WA_API_VERSION}/${params.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: params.to,
      type: "text",
      text: { preview_url: false, body: params.message },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
  }
  return res.json();
}

export async function sendWhatsAppTemplate(params: {
  to: string;
  templateName: string;
  languageCode: string;
  components?: unknown[];
  phoneNumberId: string;
  token: string;
}) {
  const url = `${BASE_URL}/${WA_API_VERSION}/${params.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "template",
      template: {
        name: params.templateName,
        language: { code: params.languageCode },
        components: params.components ?? [],
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`WhatsApp template error: ${JSON.stringify(error)}`);
  }
  return res.json();
}

// Parse incoming WhatsApp webhook payload
export function parseWebhookMessage(body: Record<string, unknown>) {
  try {
    const entry = (body.entry as unknown[])?.[0] as Record<string, unknown>;
    const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown>;
    const value = change?.value as Record<string, unknown>;
    const messages = value?.messages as unknown[];
    const contacts = value?.contacts as unknown[];

    if (!messages?.length) return null;

    const message = messages[0] as Record<string, unknown>;
    const contact = contacts?.[0] as Record<string, unknown>;

    return {
      from: (message.from as string) ?? "",
      text: ((message.text as Record<string, string>)?.body) ?? "",
      messageId: (message.id as string) ?? "",
      phoneNumberId: ((value.metadata as Record<string, string>)?.phone_number_id) ?? "",
      customerName: ((contact?.profile as Record<string, string>)?.name) ?? "",
      timestamp: (message.timestamp as string) ?? "",
    };
  } catch {
    return null;
  }
}

// Send automated booking notification to the business owner
export async function sendOwnerNotification(params: {
  ownerPhone: string;
  customerName: string;
  customerPhone: string;
  service: string;
  time: string;
  phoneNumberId: string;
  token: string;
}) {
  const message = `🚨 *New Booking Alert!*\n\n*Customer:* ${params.customerName}\n*Phone:* ${params.customerPhone}\n*Service:* ${params.service}\n*Time:* ${params.time}\n\nCheck your dashboard for details!`;
  
  return sendWhatsAppMessage({
    to: params.ownerPhone,
    message: message,
    phoneNumberId: params.phoneNumberId,
    token: params.token,
  });
}
