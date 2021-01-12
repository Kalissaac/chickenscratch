import { magic } from '@shared/magic'
import jwt from 'jsonwebtoken'
import { setTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function login (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const didToken = req.headers.authorization?.substr(7) as string
    magic.token.validate(didToken)
    const metadata = await magic.users.getMetadataByToken(didToken)
    const token = jwt.sign(
      {
        ...metadata,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 * 2 // one week
      },
      process.env.JWT_SECRET
    )
    setTokenCookie(res, token)
    res.status(200).json({ done: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
