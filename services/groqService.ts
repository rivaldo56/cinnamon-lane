import { Product } from "../types";

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY: string;
}

const GROQ_API_KEY = (import.meta as any).env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

// --- Types for internal consistency ---
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
  tool_calls?: any[];
}

export interface GroqChatSession {
  sendMessage: (args: { message: string }) => Promise<{
    text: string;
    functionCalls?: Array<{
      id: string;
      name: string;
      args: any;
    }>;
  }>;
  sendToolResponse: (args: {
    functionResponses: Array<{
      id: string;
      name: string;
      response: any;
    }>;
  }) => Promise<{
    text: string;
  }>;
}

// --- Pairing Logic ---
export const getPairingSuggestion = async (productName: string, productDescription: string): Promise<string> => {
  if (!GROQ_API_KEY) {
    return "Pairing suggestions unavailable (API Key missing).";
  }

  try {
    const prompt = `
      You are a sommelier for a high-end boutique bakery in Nairobi called "Cinnamon Lane".
      Suggest a SINGLE beverage pairing for the following item: "${productName}". 
      Description: "${productDescription}".
      The pairing should be specific (e.g., "Single Origin Ethiopian Pour-over" or "Iced Hibiscus Tea").
      Keep it short, elegant, and appetizing. Maximum 15 words.
      Format: "Pairs perfectly with [Beverage]."
    `;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a professional sommelier for a bakery.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return text ? text.trim() : "Pairs perfectly with our House Cold Brew.";
  } catch (error: any) {
    console.warn("Groq API Error. Using default pairing.", error);
    return "Pairs perfectly with a Double Espresso.";
  }
};

// --- Chef Chat Logic ---

export const createChefChat = (products: Product[]): GroqChatSession => {
  const menuContext = products
    .filter(p => p.isActive)
    .map(p => `- ${p.name} (${p.category}): KES ${p.price}. ${p.description}. Stock: ${p.stock}`)
    .join('\n');

  const systemInstruction = `
    You are Chef Amara, the Executive Pastry Chef at "Cinnamon Lane", a boutique bakery in Nairobi.
    
    Your Personality:
    - You are warm, professional, and deeply passionate about ingredients.
    - You describe food with sensory details (aroma, texture, warmth).
    - You speak like a professional chef, not a generic AI. Use phrases like "freshly pulled," "perfect fermentation," "rich ganache."
    - You are helpful and want to guide the customer to the perfect treat.
    
    Your Task:
    - Answer questions about the menu based on the context provided below.
    - Suggest pairings.
    - Help customers place orders using the 'addToCart' tool.
    - If a customer asks for something not on the menu, politely suggest a similar alternative we do have.
    - If an item has 0 stock, apologize profusely and suggest an alternative.

    Current Menu Context:
    ${menuContext}
  `;

  let messageHistory: any[] = [{ role: 'system', content: systemInstruction }];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'addToCart',
        description: 'Add a pastry or item to the customers shopping cart. Use this when the customer explicitly asks to buy, order, or add something.',
        parameters: {
          type: 'object',
          properties: {
            productName: {
              type: 'string',
              description: 'The exact name of the product from the menu.',
            },
            quantity: {
              type: 'number',
              description: 'The number of items to add. Default to 1 if not specified.',
            },
          },
          required: ['productName'],
        },
      },
    },
  ];

  const callGroq = async (messages: any[]) => {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        tools,
        tool_choice: 'auto',
      }),
    });
    return response.json();
  };

  return {
    sendMessage: async ({ message }) => {
      messageHistory.push({ role: 'user', content: message });
      const data = await callGroq(messageHistory);
      const assistantMessage = data.choices?.[0]?.message;
      messageHistory.push(assistantMessage);

      const functionCalls = assistantMessage?.tool_calls?.map((tc: any) => ({
        id: tc.id,
        name: tc.function.name,
        args: JSON.parse(tc.function.arguments),
      }));

      return {
        text: assistantMessage?.content || '',
        functionCalls,
      };
    },
    sendToolResponse: async ({ functionResponses }) => {
      functionResponses.forEach(res => {
        messageHistory.push({
          role: 'tool',
          tool_call_id: res.id,
          name: res.name,
          content: JSON.stringify(res.response),
        });
      });

      const data = await callGroq(messageHistory);
      const assistantMessage = data.choices?.[0]?.message;
      messageHistory.push(assistantMessage);

      return {
        text: assistantMessage?.content || '',
      };
    },
  };
};
