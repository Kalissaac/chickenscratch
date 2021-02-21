import { magic } from '@shared/magic'
import { setTokenCookie, signToken } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import SignJWT from 'jose/webcrypto/jwt/sign'

export default async function login (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const didToken = req.headers.authorization?.substr(7) as string
    magic.token.validate(didToken)
    const metadata = await magic.users.getMetadataByToken(didToken)
    const token = await signToken(metadata)
    setTokenCookie(res, token)
    res.status(200).json({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
