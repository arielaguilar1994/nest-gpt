import { GoogleGenAI } from '@google/genai';
import { IOptions } from '../common/interfaces';

export const orthographyCheckUseCase = async (
  gemini: GoogleGenAI,
  option: IOptions,
) => {
  const { prompt } = option;

  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    config: {
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `
              Te seran proveídos textos con posibles errores ortográficos y gramaticales,
              Tu tarea es corregirlos y retornar informacion soluciones,
              tambien debes de dar un porcentaje de acierto por el usuario,

              Si no hay errores, debes de retornar un mensaje de felicitaciones

              Ejemplo de salid:
              {
                userScore: numbre,
                errors: string[], // [' error -> solución ']
                message: string, // Usa emojis y texto para felicitar al usuario
              }
            `,
          },
        ],
      },
      responseMimeType: 'application/json',
      temperature: 0.3, // temperatura para que delire en la respuesta mas cerca del cero mas acertada,
      maxOutputTokens: 1000,
    },
  });

  // console.log(response);

  return JSON.parse(response.text ?? '');
};
