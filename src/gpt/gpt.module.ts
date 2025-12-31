import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [GptController],
  imports: [ConfigModule],
  providers: [GptService],
})
export class GptModule {}
