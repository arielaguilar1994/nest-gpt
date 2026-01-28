import { GoogleGenAI } from "@google/genai";
import { getImageGeneratedBase64, saveImageFromBuffer } from "src/helpers";

export const imageVariationUseCase = async (gemini: GoogleGenAI, imageBase: string) => {
  try {
    const imageBase64 = getImageGeneratedBase64(imageBase);

    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        { inlineData: { mimeType: 'image/png', data: imageBase64 } }
      ],
      config: {
        systemInstruction: {
          role: 'system',
          parts: [
            {
              text: `You will be provided with an image from which you will create a variation.`
            }
          ]
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error('Api gemini no response');
    }

    let textPrompt = '';
    for (const part of parts) {
      if(part.text) {
        textPrompt = part.text;
      } else {
        const imageData = part.inlineData?.data;
        const buffer = Buffer.from(imageData!, 'base64');

        const imageName = await saveImageFromBuffer(buffer);
        return {
          url: `${process.env.SERVER_URL}/gpt/image-generation/${imageName}`,
          revised_prompt: textPrompt,
        };
      }
    }
  } catch (error) {
    throw error;
  }
};