import { HttpStatus } from "@nestjs/common";

export interface IGeminiError {
  name: string;
  status: HttpStatus;
  message: string;
}
