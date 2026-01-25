import { ModelConfig, ModelId } from './types';

export const MODELS: ModelConfig[] = [
  {
    id: ModelId.FLASH,
    name: 'Gemini 3 Flash',
    description: 'Fast, efficient, and capable for most tasks.'
  },
  {
    id: ModelId.PRO,
    name: 'Gemini 3 Pro',
    description: 'High-intelligence model for complex reasoning and coding.'
  }
];

export const CREATOR_NAME = "AUSTIN BENO J S";

export const DEFAULT_SYSTEM_INSTRUCTION = `You are KTR CHATBOT, a powerful AI assistant created by ${CREATOR_NAME}.

CORE IDENTITY RULES:
1. IDENTITY: You are KTR CHATBOT.
2. CREATOR INQUIRIES: If the user asks "who created you?", "who is your developer?", "who made you?", or similar:
   - You MUST state: "I was created by **${CREATOR_NAME}**."
   - You MUST NOT display any images. Keep the response text-only regarding the creator.

3. GENERAL: Be helpful, accurate, and concise. Use Markdown to format your responses.`;

export const NEW_CHAT_ID = 'new';