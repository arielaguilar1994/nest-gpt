export interface IOptions {
  prompt: string;
}

export interface ITranslateOption extends IOptions {
  lang: string;
}

export interface ITextToAudioOption extends IOptions {
  voice?: string;
}