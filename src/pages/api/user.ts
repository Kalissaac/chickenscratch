import jwt from 'jsonwebtoken'
import { setTokenCookie, verifyTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@shared/mongo'
import User from '@interfaces/user'

export default async function GetUser (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.cookies.token === '') throw new Error('No user token cookie available')
    if (!process.env.JWT_SECRET) throw new Error('No JWT secret environment variable found')

    const { issuer, publicAddress, email } = verifyTokenCookie(req.cookies.token)
    const newToken = jwt.sign({
      issuer,
      publicAddress,
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // one week
    },
    process.env.JWT_SECRET)
    setTokenCookie(res, newToken)

    const { client } = await connectToDatabase()
    const user: User = await client.db('data').collection('users').findOne({ _id: publicAddress })
    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(401).json({ user: null, message: 'User is not authenticated!' })
  }
}
