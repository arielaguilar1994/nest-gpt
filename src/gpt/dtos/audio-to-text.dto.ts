import { IsOptional, IsString } from "class-validator";

export class AudioToTextDto {
  @IsString()
  @IsOptional()
  prompt: string;
}