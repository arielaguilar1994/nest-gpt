import * as path from 'path';
import * as fs from 'fs';

import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  orthographyCheckUseCase,
  proConsDiscusserStreamUseCase,
  proConsDiscusserUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  OrthographyDto,
  ProConsDiscusserDTO,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { IErrorGemini } from './common/interfaces';
import { textToAudioUseCase } from './use-cases/textToAudio.use-case';
import { audioToTextUseCase } from './use-cases/audio-to-text.use-case';

@Injectable()
export class GptService {
  private gemini: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.gemini = new GoogleGenAI({
      apiKey: this.configService.get('GEMINI_API_KEY')!,
    });
  }

  async orthographyCheck(orthographyDto: OrthographyDto) {
    try {
      return await orthographyCheckUseCase(this.gemini, {
        prompt: orthographyDto.prompt,
      });
    } catch (error) {
      this.HandleException(error);
    }
  }

  async prosConsDiscusser(proConsDiscusserDTO: ProConsDiscusserDTO) {
    try {
      return await proConsDiscusserUseCase(this.gemini, {
        prompt: proConsDiscusserDTO.prompt,
      });
    } catch (error) {
      this.HandleException(error);
    }
  }

  async prosConsDiscusserStream(proConsDiscusserDTO: ProConsDiscusserDTO) {
    try {
      return await proConsDiscusserStreamUseCase(this.gemini, {
        prompt: proConsDiscusserDTO.prompt,
      });
    } catch (error) {
      this.HandleException(error);
    }
  }

  async translate(translateDto: TranslateDto) {
    try {
      return await translateUseCase(this.gemini, {
        prompt: translateDto.prompt,
        lang: translateDto.lang,
      });
    } catch (error) {
      this.HandleException(error);
    }
  }

  async textToAudio(textToAudio: TextToAudioDto) {
    try {
      return await textToAudioUseCase(this.gemini, {
        prompt: textToAudio.prompt,
        voice: textToAudio.voice,
      });
    } catch (error) {
      this.HandleException(error);
      throw error;
    }
  }

  async getAudioFileByName(fileName: string) {
    try {
      const filePath = path.resolve(
        __dirname,
        '../../generated/audios/',
        `${fileName}.wav`,
      );
      const wasFound = fs.existsSync(filePath);

      if (!wasFound)
        throw new NotFoundException(`File ${fileName} was not found`);

      return filePath;
    } catch (error) {
      this.HandleException(error);
      throw error;
    }
  }

  async audioToText(
    audioToText: AudioToTextDto,
    audioFile: Express.Multer.File,
  ) {
    try {
      // prompt: 'Transcribe this audio file like WEBVTT format',
      // prompt: 'Transcribe this audio file like verbose_json format',
      return await audioToTextUseCase(this.gemini, {
        prompt: audioToText.prompt,
        audioFile,
      });
    } catch (error) {
      this.HandleException(error);
    }
  }

  private HandleException({ error }: IErrorGemini) {
    if (error?.code === HttpStatus.TOO_MANY_REQUESTS) {
      throw new BadRequestException(error.message);
    }
  }
}
