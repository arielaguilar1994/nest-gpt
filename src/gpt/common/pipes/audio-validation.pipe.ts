import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AudioValidationPipe implements PipeTransform {
  constructor(private readonly maxSizeMB = 5) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const maxBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(`File exceeds ${this.maxSizeMB}MB`);
    }

    if (!/^audio\/.*/.test(file.mimetype)) {
      throw new BadRequestException('Only audio files are allowed');
    }

    return file;
  }
}
