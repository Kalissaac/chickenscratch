import { magic } from '@shared/magic'
import { removeTokenCookie, verifyTokenCookie } from '@shared/cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function logout (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (!req.cookies.token) return res.status(401).json({ message: 'User is not logged in' })
    const token = req.cookies.token
    const user = await verifyTokenCookie(token)
    await magic.users.logoutByIssuer(user.iss)
    removeTokenCookie(res)
    res.redirect('/login')
    res.end()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Error signing out user' })
  }
}
