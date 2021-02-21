import { serialize } from 'cookie'
import type { NextApiResponse } from 'next'
import jwtVerify from 'jose/jwt/verify'
import SignJWT from 'jose/jwt/sign'

const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 24 * 7 // 1 week

export async function signToken (metadata: any): Promise<string> {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable not found!')

  const token = await new SignJWT({
    email: metadata.email,
    publicAddress: metadata.publicAddress
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1 week')
    .setIssuer(metadata.issuer ?? '')
    .sign(Buffer.from(process.env.JWT_SECRET, 'base64'))

  return token
}

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
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable not found!')
  if (!token) {
    const error = new Error()
    error.name = 'USER_NOT_AUTHENTICATED'
    error.message = 'No authentication token provided'
    throw error
  }
  try {
    const result = await jwtVerify(token, Buffer.from(process.env.JWT_SECRET, 'base64'))
    return result.payload as jwtUser
  } catch (originalError) {
    if (originalError.name === 'JWSSignatureVerificationFailed') {
      const error = new Error()
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'JWT signature verification failed'
      throw error
    }
    throw originalError
  }
}

export interface jwtUser {
  iss: string
  email: string
  publicAddress: string
  iat: number
  exp: number
}
