import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { audioStorage } from '../utils/multer-storage.util';

export const UploadAudio = (fieldName = 'file') => {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, { storage: audioStorage })),
  );
};
