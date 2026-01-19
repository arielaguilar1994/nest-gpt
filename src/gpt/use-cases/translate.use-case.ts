import { GoogleGenAI } from '@google/genai';
import { ITranslateOption } from '../common/interfaces';

export const translateUseCase = async (
  gemini: GoogleGenAI,
  { prompt, lang }: ITranslateOption,
) => {

  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: `Traduce el siguiente texto al idioma ${lang}:${ prompt }` }]
      }
    ],
    config: {
      temperature: 0.3,
      maxOutputTokens: 500
    }
  });

  return { message: response.text };
};
