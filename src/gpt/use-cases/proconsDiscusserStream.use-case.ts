import { GoogleGenAI } from '@google/genai';
import { IOptions } from '../common/interfaces';

export const proConsDiscusserStreamUseCase = async (
  gemini: GoogleGenAI,
  { prompt }: IOptions,
) => {
  return await gemini.models.generateContentStream({
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
      temperature: 0.3,
    }
  });
};
