import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert Blob/File to Base64 string (without prefix)
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateRoomLighting = async (
  imageBase64: string, 
  color: string
): Promise<string | null> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  try {
    const prompt = `Change the ambient lighting of this room to be strictly ${color}. 
    The room should look illuminated by ${color} neon or smart lights. 
    Keep the room structure and furniture identical. High quality, photorealistic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using flash-image for speed/quality balance
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      },
    });

    // Extract image from response
    // The response for image generation/edit usually contains the image in the parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating ${color} lighting:`, error);
    return null;
  }
};