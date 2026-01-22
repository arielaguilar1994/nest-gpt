import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  OrthographyDto,
  ProConsDiscusserDTO,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { diskStorage } from 'multer';
import { AudioFile } from './common/decorators/audio-file.decorator';
import { UploadAudio } from './common/decorators/upload-audio.decorator';

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
  async textToAudio(@Body() textToAudio: TextToAudioDto, @Res() res: Response) {
    const audioPath = await this.gptService.textToAudio(textToAudio);

    res.setHeader('Content-Type', 'audio/wav');
    res.status(HttpStatus.OK);

    res.sendFile(audioPath, (err) => {
      if (err) res.status(HttpStatus.NOT_FOUND).send('Error to load file');
    });
  }

  @Get('text-to-audio/:fileName')
  async getAudioFile(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const audioFile = await this.gptService.getAudioFileByName(fileName);

    response.setHeader('Content-Type', 'audio/wav');
    response.status(HttpStatus.OK);

    return response.sendFile(audioFile);
  }

  // Mejorado con los decoradores globales
  // @Post('audio-to-text')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './generated/uploads',
  //       filename: (req, file, callback) => {
  //         const fileExtension = file.originalname.split('.').pop();
  //         const fileName = `${new Date().getTime()}.${fileExtension}`;
  //         return callback(null, fileName);
  //       },
  //     }),
  //   }),
  // )
  // async audioToText(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({
  //           maxSize: 1000 * 1024 * 5,
  //           errorMessage: 'File is bigger than 5 mb',
  //         }),
  //         new FileTypeValidator({
  //           fileType: /^audio\/.*/
  //         })
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  @Post('audio-to-text')
  @UploadAudio()
  async audioToText(
    @AudioFile() file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ){
    return await this.gptService.audioToText(
      audioToTextDto,
      file
    );
  }
}
