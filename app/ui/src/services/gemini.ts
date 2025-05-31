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

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
  model: any; // Gemini chat model
}

let chatHistory: ChatHistory | null = null;

export const initializeChat = async () => {
  if (!chatHistory) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    chatHistory = {
      messages: [],
      model: chat,
    };
  }
  return chatHistory;
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!chatHistory) {
    await initializeChat();
  }

  try {
    const result = await chatHistory!.model.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
};

// Save chat history to localStorage
export const saveChatHistory = () => {
  if (chatHistory) {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.messages));
  }
};

// Load chat history from localStorage
export const loadChatHistory = async () => {
  const savedMessages = localStorage.getItem('chatHistory');
  if (savedMessages) {
    const messages = JSON.parse(savedMessages);
    await initializeChat();
    chatHistory!.messages = messages;
    return messages;
  }
  return [];
};
