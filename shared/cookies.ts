import { serialize } from 'cookie'
import type { NextApiResponse } from 'next'

const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 24 * 7 // 1 week

export function setTokenCookie (res: NextApiResponse, token): void {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // if true, cookie will only be set if https
    path: '/',
    sameSite: 'lax'
  })

  res.setHeader('Set-Cookie', cookie)
}

export function removeTokenCookie (res: NextApiResponse): void {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/'
  })

  res.setHeader('Set-Cookie', cookie)
}
