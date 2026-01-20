import * as path from 'path';
import * as fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { ITextToAudioOption } from '../common/interfaces';

//generacion de audio
import wav from 'wav';

export const textToAudioUseCase = async (gemini: GoogleGenAI, option: ITextToAudioOption) => {
  const { prompt, voice = 'Kore' } = option;

  const folderPath = path.resolve(__dirname, '../../../generated/audios/');
  const speechFile = path.resolve(`${folderPath}/${ new Date().getTime() }.wav`);

  fs.mkdirSync(folderPath, { recursive: true }); // true si no existe recursivamente los crea

  const result = await gemini.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts', //'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: `Lee este texto con una vos profesional y calmada: ${prompt}` }]
      }
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
      }
    }
  });

  const base64Data = result.candidates?.[0].content?.parts?.[0]?.inlineData?.data;
  if(!base64Data) throw new Error('No audio data in response');

  const buffer = Buffer.from(base64Data, 'base64');
  await saveFile(speechFile, buffer);

  return speechFile;
}

const saveFile = async (speechFile: string, buffer: Buffer<ArrayBuffer>) => {
  return await new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(speechFile, {
      channels: 1,
      sampleRate: 24000,
      bitDepth: 2 * 8
    });

    writer.on('finish', resolve);
    writer.on('error', reject);
    
    writer.write(buffer);
    writer.end();
  });
}