import { BadRequestException, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  proConsDiscusserStreamUseCase,
  proConsDiscusserUseCase,
} from './use-cases';
import { OrthographyDto, ProConsDiscusserDTO, TranslateDto } from './dtos';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { IErrorGemini } from './common/interfaces';
import { translateUseCase } from './use-cases/translate.use-case';

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
        lang: translateDto.lang
      });
    } catch (error) {
      this.HandleException(error);
    }
  }

  private HandleException({error}: IErrorGemini) {
    if(error.code === HttpStatus.TOO_MANY_REQUESTS) {
      throw new BadRequestException(error.message);
    }
  }
}
