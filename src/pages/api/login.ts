import { magic } from '@shared/magic'
import { setTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import SignJWT from 'jose/webcrypto/jwt/sign'

export default async function login (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const didToken = req.headers.authorization?.substr(7) as string
    magic.token.validate(didToken)
    const metadata = await magic.users.getMetadataByToken(didToken)
    const token = await new SignJWT({
      email: metadata.email,
      publicAddress: metadata.publicAddress
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('1 week')
      .setIssuer(metadata.issuer ?? '')
      .sign(Buffer.from(process.env.JWT_SECRET ?? ''))
    setTokenCookie(res, token)
    res.status(200).json({ done: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
