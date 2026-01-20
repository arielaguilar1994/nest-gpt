import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProConsDiscusserDTO,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { response, type Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() proConsDiscusserDTO: ProConsDiscusserDTO) {
    return this.gptService.prosConsDiscusser(proConsDiscusserDTO);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() proConsDiscusserDTO: ProConsDiscusserDTO,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(proConsDiscusserDTO);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream!) {
      const piece = chunk.text || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudio: TextToAudioDto,
    @Res() response: Response,
  ) {
    const audioBuffer = await this.gptService.textToAudio(textToAudio);

    if (audioBuffer) {
      response.setHeader('Content-Type', 'audio/wav');
      response.status(HttpStatus.OK);

      return response.sendFile(audioBuffer);
    } else {
      response.status(HttpStatus.NOT_FOUND);
      return response.send({ message: 'audio buffer not found' });
    }
  }

  @Get('text-to-audio/:fileName')
  async getAudioFile(
    @Param('fileName') fileName: string,
    @Res() response: Response
  ) {
    const audioFile = await this.gptService.getAudioFileByName(fileName);

    response.setHeader('Content-Type', 'audio/wav');
    response.status(HttpStatus.OK);

    return response.sendFile(audioFile);
  }
}
