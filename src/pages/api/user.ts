import { setTokenCookie, signToken, verifyTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@shared/mongo'
import type User from '@interfaces/user'
import { responseHandler } from '@shared/error'

const JWT_SECRET = process.env.JWT_SECRET ?? ''
if (!JWT_SECRET) throw new Error('No JWT secret environment variable found')

export default async function GetUser (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (!req.cookies.token) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }

    const { iss, publicAddress, email, iat } = await verifyTokenCookie(req.cookies.token)
    if ((Date.now() / 1000) - iat > 3600) { // if token was created more than an hour ago, refresh it
      const newToken = await signToken({ publicAddress, email, issuer: iss })
      setTokenCookie(res, newToken)
    }

    const { client } = await connectToDatabase()
    const user: User = await client.db('data').collection('users').findOne({ _id: publicAddress })
    if (!user) {
      res.redirect('/onboarding')
      return
    }

    res.json({ user })
  } catch (error) {
    responseHandler(error, res)
  }
}
