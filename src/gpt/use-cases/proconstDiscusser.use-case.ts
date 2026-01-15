import { GoogleGenAI } from '@google/genai';
import { IOptions } from '../common/interfaces';

export const proConsDiscusserUseCase = async (
  gemini: GoogleGenAI,
  options: IOptions,
) => {
  const { prompt } = options;

  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    config: {
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `
              Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
              la respuesta debe de ser en formato markdown,
              los pros y contras deben de estar en una lista,
            `
          },
        ],
      },
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 1000
    }
  });

  return response.candidates ? response.candidates[0].content : 'Error to proccess the consult';
};
