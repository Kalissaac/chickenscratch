import { setTokenCookie, verifyTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@shared/mongo'
import type User from '@interfaces/user'
import SignJWT from 'jose/jwt/sign'

const JWT_SECRET = process.env.JWT_SECRET ?? ''
if (!JWT_SECRET) throw new Error('No JWT secret environment variable found')

export default async function GetUser (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (req.cookies.token === '') {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }

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
        .sign(Buffer.from(JWT_SECRET, 'base64'))
      setTokenCookie(res, newToken)
    }

    const { client } = await connectToDatabase()
    const user: User = await client.db('data').collection('users').findOne({ _id: publicAddress })

    if (!user) {
      error.name = 'USER_NOT_FOUND'
      error.message = 'MongoDB failed to locate user with id: ' + publicAddress
      throw error
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ user: null, message: error.name })
  }
}
