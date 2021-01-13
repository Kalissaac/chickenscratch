import jwt from 'jsonwebtoken'
import { setTokenCookie, jwtUser } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function user (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.cookies.token === '') return res.json({ user: null })
    const token = req.cookies.token
    const user = jwt.verify(token, process.env.JWT_SECRET ?? '') as jwtUser
    const { issuer, publicAddress, email } = user
    const newToken = jwt.sign(
      {
        issuer,
        publicAddress,
        email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // one week
      },
      process.env.JWT_SECRET ?? ''
    )
    setTokenCookie(res, newToken)
    res.status(200).json({ user })
  } catch (error) {
    res.status(200).json({ user: null })
  }
}
