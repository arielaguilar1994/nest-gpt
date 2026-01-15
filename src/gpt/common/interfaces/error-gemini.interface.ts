export interface IErrorGemini {
  error: Error
}

export interface Error {
  message: string
  code: number
  status: string
}
