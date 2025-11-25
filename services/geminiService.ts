import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client
const ai = new GoogleGenAI({ apiKey });

// Models
const CHAT_MODEL = 'gemini-2.5-flash';
const TITLE_MODEL = 'gemini-2.5-flash-lite';

export const streamResponse = async (
  history: Message[],
  newMessage: string,
  onChunk: (text: string, metadata?: any) => void
) => {
  try {
    // Transform history for the API
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const chat = ai.chats.create({
      model: CHAT_MODEL,
      history: chatHistory,
      config: {
        tools: [{ googleSearch: {} }], // Enable Grounding
        systemInstruction: "You are Minerva, an intelligent and helpful AI assistant. You provide clear, concise, and accurate information. When you use search tools, ensure you integrate the information naturally.",
      }
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        // Check for text
        if (c.text) {
           onChunk(c.text, c.candidates?.[0]?.groundingMetadata);
        }
    }
  } catch (error) {
    console.error("Error streaming response:", error);
    throw error;
  }
};

export const generateTitle = async (firstMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: TITLE_MODEL,
      contents: `Generate a very short, 3-5 word concise title for a chat that starts with this message: "${firstMessage}". Do not use quotes.`,
    });
    return response.text?.trim() || "New Conversation";
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
};