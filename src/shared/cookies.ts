import { serialize } from 'cookie'
import type { NextApiResponse } from 'next'
import jwtVerify from 'jose/jwt/verify'

const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 24 * 7 // 1 week

if (!process.env.JWT_SECRET) throw new Error('MONGODB_URI environment variable not found!')

export function setTokenCookie (res: NextApiResponse, token: string): void {
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

export async function verifyTokenCookie (token: string): Promise<jwtUser> {
  try {
    const result = await jwtVerify(token, Buffer.from(process.env.JWT_SECRET ?? '', 'base64'))
    return result.payload as jwtUser
  } catch (error) {
    throw new Error(error)
  }
}

export interface jwtUser {
  iss: string
  email: string
  publicAddress: string
  iat: number
  exp: number
}
