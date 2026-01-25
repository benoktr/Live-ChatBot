import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role, ModelId } from "../types";
import { DEFAULT_SYSTEM_INSTRUCTION } from "../constants";

// Initialize the API client
// Ideally this should be outside the render loop, but we need the API key from env
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Creates a chat instance with history
 */
export const createChatSession = (modelId: string, history: Message[] = []) => {
  const ai = getClient();
  
  // Transform app history to SDK history format if needed
  // However, the `chats.create` mainly sets up the session. 
  // We can't easily pre-seed the `Chat` object from the SDK with a custom history 
  // without re-playing it or managing `history` prop in config.
  // The SDK `chats.create` allows `history` in config.
  
  const sdkHistory = history.map(msg => ({
    role: msg.role === Role.USER ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const chat: Chat = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
    },
    history: sdkHistory
  });

  return chat;
};

/**
 * Sends a message and yields streaming chunks
 */
export async function* sendMessageStream(
  chat: Chat, 
  message: string
): AsyncGenerator<string, void, unknown> {
  
  try {
    const resultStream = await chat.sendMessageStream({ message });

    for await (const chunk of resultStream) {
      const responseChunk = chunk as GenerateContentResponse;
      const text = responseChunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Error in sendMessageStream:", error);
    throw error;
  }
}

/**
 * Helper to generate a title for a new chat based on the first message
 */
export const generateChatTitle = async (firstMessage: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: ModelId.FLASH,
      contents: `Summarize this message into a short, concise title (max 4-5 words) for a chat history. Do not include quotes. Message: "${firstMessage}"`,
    });
    return response.text?.trim() || "New Chat";
  } catch (e) {
    return "New Chat";
  }
};