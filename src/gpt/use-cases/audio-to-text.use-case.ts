import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { IAudioToTextOption } from "../common/interfaces";

export const audioToTextUseCase = async (
  gemini: GoogleGenAI,
  options: IAudioToTextOption
) => {
  const { prompt = 'Describe this audio clip', audioFile } = options;
  const file = await gemini.files.upload({
    file: audioFile.path,
    config: { mimeType: audioFile.mimetype }
  });

  if(file.error) {
    throw new Error(`Error uploading file: ${file.error.message}`);
  }

  if(!file.uri || !file.mimeType) {
    throw new Error('File upload did not return a valid URI or mimeType');
  }

  const response = await gemini.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: createUserContent([
      createPartFromUri(file.uri, file.mimeType),
      prompt
    ]),
    config: {
      responseMimeType: 'application/json'
    }
  });

  return JSON.parse(response.text ?? '');
};
