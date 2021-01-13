import { magic } from '@shared/magic'
import { removeTokenCookie } from '@shared/cookies'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

interface jwtUser {
  issuer: string
  email: string
  publicAddress: string
  exp: Number
}

export default async function logout (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.cookies.token === '') return res.status(401).json({ message: 'User is not logged in' })
    const token = req.cookies.token
    const user = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as jwtUser
    await magic.users.logoutByIssuer(user.issuer)
    removeTokenCookie(res)
    res.redirect('/login')
    res.end()
  } catch (error) {
    res.status(401).json({ message: 'User is not logged in' })
  }
}
