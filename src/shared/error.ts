import type { NextApiResponse } from 'next'

export enum ErrorType {
  NotAuthenticated = 'USER_NOT_AUTHENTICATED',
  InternalSecret = 'INTERNAL_SECRET',
  NotFound = 'FILE_NOT_FOUND',
  NoID = 'NO_ID_SPECIFIED',
  NoBody = 'NO_BODY',
  UserNotFound = 'USER_NOT_FOUND',
  Unknown = 'UNKNOWN_ERROR'
}

export class APIError extends Error {
  name: string
  message: string
  stacktrace: string
  type: ErrorType | undefined

  constructor (name: string, message: string, stacktrace: string) {
    super(message)
    this.name = name
    this.message = message
    this.stacktrace = stacktrace
  }
}

export function responseHandler (error: Error, res: NextApiResponse): void {
  switch (error.name) {
    case ErrorType.NotAuthenticated:
      res.status(401).json({ error: error.name })
      break
    case ErrorType.NotFound:
    case ErrorType.UserNotFound:
      res.status(404).json({ error: error.name })
      break
    case ErrorType.NoID:
    case ErrorType.NoBody:
      res.status(400).json({ error: error.name })
      break
    default:
      console.error(error)
      res.status(500).json({ error: error.name })
      break
  }
}
