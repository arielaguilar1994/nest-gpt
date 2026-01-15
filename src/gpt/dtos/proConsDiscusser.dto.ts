import { IsString } from "class-validator";

export class ProConsDiscusserDTO {
  @IsString()
  readonly prompt: string;
}