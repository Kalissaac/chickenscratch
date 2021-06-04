import { magic } from '@shared/magic'
import { setTokenCookie, signToken } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { responseHandler } from '@shared/error'

export default async function login (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const didToken = req.headers.authorization?.substr(7) as string
    if (!didToken) {
      error.name = 'NO_ID_SPECIFIED'
      error.message = 'No DID token was specified in the request'
      throw error
    }

    magic.token.validate(didToken)
    const metadata = await magic.users.getMetadataByToken(didToken)
    if (!metadata) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'Metadata could not be decoded from DID token'
      throw error
    }

    const token = await signToken(metadata)
    setTokenCookie(res, token)
    res.json({ success: true })
  } catch (error) {
    responseHandler(error, res)
  }
}
