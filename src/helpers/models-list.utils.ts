import { GoogleGenAI } from "@google/genai";

export const listModels = async (gemini: GoogleGenAI) => {
  const listModelsGemini = await gemini.models.list();
  console.log('ListModels', listModelsGemini);
};