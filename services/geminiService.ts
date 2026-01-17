import { GoogleGenAI, FunctionDeclaration, Type, ChatSession } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Pairing Logic ---
export const getPairingSuggestion = async (productName: string, productDescription: string): Promise<string> => {
  if (!apiKey) {
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    return text ? text.trim() : "Pairs perfectly with our House Cold Brew.";
  } catch (error: any) {
    // Handle Quota Limits (429) gracefully without alarming logs
    if (
      error?.status === 429 || 
      error?.code === 429 || 
      error?.message?.includes('429') || 
      error?.message?.includes('quota') ||
      error?.status === 'RESOURCE_EXHAUSTED'
    ) {
      console.warn(`Gemini Quota Exceeded for ${productName}. Using default pairing.`);
      return "Pairs perfectly with a Double Espresso.";
    }

    console.error("Gemini API Error:", error);
    return "Pairs perfectly with a Double Espresso.";
  }
};

// --- Chef Chat Logic ---

const addToCartTool: FunctionDeclaration = {
  name: 'addToCart',
  description: 'Add a pastry or item to the customers shopping cart. Use this when the customer explicitly asks to buy, order, or add something.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: 'The exact name of the product from the menu.',
      },
      quantity: {
        type: Type.NUMBER,
        description: 'The number of items to add. Default to 1 if not specified.',
      },
    },
    required: ['productName'],
  },
};

export const createChefChat = (products: Product[]): ChatSession => {
  // Create a context string of the current menu
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

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [addToCartTool] }],
    },
  });
};