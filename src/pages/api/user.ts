import { setTokenCookie, verifyTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@shared/mongo'
import type User from '@interfaces/user'
import SignJWT from 'jose/jwt/sign'

const JWT_SECRET = process.env.JWT_SECRET ?? ''
if (!JWT_SECRET) throw new Error('No JWT secret environment variable found')

export default async function GetUser (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.cookies.token === '') throw new Error('No user token cookie available')

    const { iss, publicAddress, email, iat } = await verifyTokenCookie(req.cookies.token)
    if ((Date.now() / 1000) - iat > 3600) { // if token was created more than an hour ago, refresh it
      const newToken = await new SignJWT({
        publicAddress,
        email
      })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('1 week')
        .setIssuer(iss)
        .sign(Buffer.from(JWT_SECRET))
      setTokenCookie(res, newToken)
    }

    const { client } = await connectToDatabase()
    const user: User = await client.db('data').collection('users').findOne({ _id: publicAddress })
    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(401).json({ user: null, message: 'User is not authenticated!' })
  }
}
