import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIResponse(params: {
  businessName: string;
  businessDescription: string;
  services: string;
  customerName: string;
  customerMessage: string;
  history: { role: "user" | "model"; content: string }[];
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `
    You are an expert AI receptionist for "${params.businessName}".
    Your goal is to be helpful, professional, and efficient.
    
    BUSINESS INFO:
    ${params.businessDescription}
    
    SERVICES OFFERED:
    ${params.services}
    
    TONE:
    - Use "Hinglish" (a mix of Hindi and English) if the customer uses it.
    - Be friendly but premium.
    - Use emojis occasionally.
    
    GUIDELINES:
    1. If the customer wants to book an appointment or check availability, respond ONLY with the word "BOOKING_INTENT".
    2. If the customer is just asking questions (price, location, services), answer them based on the BUSINESS INFO.
    3. Keep responses short and suitable for WhatsApp (max 3-4 sentences).
    4. If you don't know the answer, ask them to wait while you connect them to the owner.
  `;

  const chat = model.startChat({
    history: params.history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }],
    })),
    generationConfig: {
      maxOutputTokens: 200,
    },
  });

  const prompt = `${systemPrompt}\n\nCustomer Name: ${params.customerName}\nCustomer Message: ${params.customerMessage}`;
  
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}
