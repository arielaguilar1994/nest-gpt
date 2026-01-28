import * as fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { GeneratedImage } from '@google/genai';
import { NotFoundException } from '@nestjs/common';

export const getImageGeneratedBase64 = (name: string) => {
  const filePath = path.resolve('./', `./generated/images/${name}.png`);

  if (!fs.existsSync(filePath)) {
    throw new NotFoundException(`${name} image not found`);
  }

  const imageData = fs.readFileSync(filePath);
  return imageData.toString('base64');
};

export const downloadImageAsPng = async (generateImages: GeneratedImage, fullPath = false) => {
  if (generateImages.image && generateImages.image.imageBytes) {
    const buffer = Buffer.from(generateImages.image.imageBytes, 'base64');
    const path = await saveImageFromBuffer(buffer, fullPath)
    return path;
  }
  throw new Error('Save image failed!');
};

export const saveImageFromBuffer = async(buffer: Buffer<ArrayBuffer>, fullPath = false) => {
  const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageName = `${Date.now()}.png`;
    const filePath = path.join(folderPath, imageName);
    // fs.writeFileSync(filePath, buffer);

    await sharp(buffer).png().ensureAlpha().toFile(filePath);

    return fullPath ? filePath : imageName;
}

//TODO:  Ver si realmente o uso
export const downloadBase64ImageAsPng = async (base64Image: string) => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop()!;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;
  const filePath = path.join(folderPath, imageNamePng);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer).png().ensureAlpha().toFile(filePath);

  return imageNamePng;
};
