import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  async getStylistAdvice(userQuery: string, availableProducts: Product[]) {
    try {
      const productContext = availableProducts.map(p => 
        `- ${p.name} ($${p.price}): ${p.description} (Category: ${p.category}, Type: ${p.type})`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are VYRON AI, a futuristic luxury streetwear stylist. You are bold, edgy, and helpful. Suggest outfits based on the user's query and the available products. Return a concise, stylish response in markdown format. If no product matches perfectly, suggest the closest vibe and explain why it fits the future streetwear aesthetic.",
        },
        contents: `Available Products:\n${productContext}\n\nUser Question: "${userQuery}"`,
      });

      return response.text || "I'm having trouble connecting to the future right now. Please try again later.";
    } catch (error) {
      console.error("Gemini Stylist Error:", error);
      return "The digital void is silent. Let's try again in a moment.";
    }
  }
};
