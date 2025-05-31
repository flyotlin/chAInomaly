import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface GeminiResponse {
  text: string;
  error?: string;
}

export const generateText = async (prompt: string): Promise<GeminiResponse> => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      text: response.text(),
    };
  } catch (error) {
    console.error('Error generating text:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};

// Example usage with chat history
export const generateChatResponse = async (
  messages: { role: 'user' | 'model'; content: string }[]
): Promise<GeminiResponse> => {
  try {
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    return {
      text: response.text(),
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};
