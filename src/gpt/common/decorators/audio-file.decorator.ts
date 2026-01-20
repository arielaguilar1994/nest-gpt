import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { AudioValidationPipe } from '../pipes/audio-validation.pipe';

export const AudioFile = () => {
  return UploadedFile(new AudioValidationPipe());
  // return UploadedFile(
  //   new ParseFilePipe({
  //     validators: [
  //       new MaxFileSizeValidator({
  //         maxSize: 1000 * 1024 * 5,
  //         errorMessage: `File exceed size of 5MB`,
  //       }),
  //       new FileTypeValidator({
  //         fileType: /^audio\/.*/
  //       })
  //     ],
  //   }),
  // );
};
