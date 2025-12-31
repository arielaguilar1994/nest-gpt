import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  readonly prompt: string;

  @IsOptional()
  @IsInt()
  readonly maxTokens?: number;
}
