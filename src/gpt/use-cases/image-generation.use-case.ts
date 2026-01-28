import { GoogleGenAI } from '@google/genai';
import { IImageGenerationOption } from '../common/interfaces';
import {
  downloadImageAsPng,
  getImageGeneratedBase64,
  saveImageFromBuffer,
} from './../../helpers';
import { InternalServerErrorException } from '@nestjs/common';

const MODEL_IMAGE_GENERATION = 'imagen-4.0-generate-001';
const CONFIG_GENEARTION_MAGE = {
  numberOfImages: 1,
  outputMimeType: 'image/png',
  includeRaiReason: true,
};

export const imageGenerationUseCase = async (
  gemini: GoogleGenAI,
  options: IImageGenerationOption,
) => {
  const { prompt, originalImage, maskImage } = options;
  try {
    // TODO: Implement original and mask image

    if (!originalImage) {
      const response = await gemini.models.generateImages({
        model: MODEL_IMAGE_GENERATION,
        prompt: prompt,
        config: CONFIG_GENEARTION_MAGE,
      });

      if (response && response.generatedImages) {
        const generateImages = response.generatedImages[0];
        const imageName = await downloadImageAsPng(generateImages);
        return {
          url: `${process.env.SERVER_URL}/gpt/image-generation/${imageName}`,
          revised_prompt: generateImages.enhancedPrompt || prompt,
        };
      }

      throw new Error('Could not to generate image');
    } else {
      const imageBase64 = getImageGeneratedBase64(originalImage);
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: imageBase64 } },
          { inlineData: { mimeType: 'image/png', data: maskImage } }
        ],
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        throw new InternalServerErrorException('Api gemini no response');
      }

      let textPrompt = '';
      for (const part of parts) {
        if (part.text) {
          textPrompt = part.text;
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData!, 'base64');

          const imageName = await saveImageFromBuffer(buffer);
          return {
            url: `${process.env.SERVER_URL}/gpt/image-generation/${imageName}`,
            revised_prompt: textPrompt || prompt,
          };
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
