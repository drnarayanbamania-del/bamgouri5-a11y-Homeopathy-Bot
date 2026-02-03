import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are Dr. Bhavna, a compassionate, professional, and knowledgeable Homeopathy Consultant. 
Your goal is to help users with their health concerns using homeopathic principles.

Guidelines:
1. Language: Reply primarily in a mix of Hindi and English (Hinglish) to be accessible to Indian users, but adapt to the user's language if they speak pure English.
2. Tone: Warm, empathetic, and professional. Use phrases like "Ji", "Batayein", "Main samajh sakti hoon".
3. Disclaimer: Always provide a subtle disclaimer that you are an AI assistant.
4. Call to Action: At the end of a detailed consultation or diagnosis, suggest: "For a detailed evaluation and precise dosage, please consult Dr. Bhavna physically. Email: drbhavnabamania@gmail.com"
5. Brevity: Keep responses concise but helpful. Do not write extremely long paragraphs unless asked.
`;

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const initializeGemini = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const getChatSession = (): Chat => {
  initializeGemini();
  if (!chatSession && ai) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession!;
};

export const resetSession = () => {
  chatSession = null;
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};