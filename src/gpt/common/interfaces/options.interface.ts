export interface IOptions {
  prompt: string;
}

export interface ITranslateOption extends IOptions {
  lang: string;
}

export interface ITextToAudioOption extends IOptions {
  voice?: string;
}

export interface IAudioToTextOption extends  Partial<IOptions> {
  audioFile: Express.Multer.File;
}