import { magic } from '@shared/magic'
import { removeTokenCookie, verifyTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import { responseHandler } from '@shared/error'

export default async function logout (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (!req.cookies.token) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }

    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    await magic.users.logoutByIssuer(user.iss)
    removeTokenCookie(res)
    res.redirect('/login?logoutSuccess=1')
  } catch (error) {
    responseHandler(error, res)
  }
}
