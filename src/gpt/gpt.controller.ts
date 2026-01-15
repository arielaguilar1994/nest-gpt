import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProConsDiscusserDTO, TranslateDto } from './dtos';
import type { Response } from 'express';

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
    const stream = await this.gptService.prosConsDiscusserStream(proConsDiscusserDTO);

    res.setHeader( 'Content-Type', 'application/json' );
    res.status( HttpStatus.OK );

    for await(const chunk of stream!) {
      const piece = chunk.text || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }
}
