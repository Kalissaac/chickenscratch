import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'

export default async function GetHomepageData (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.cookies.token === '') throw new Error('NOAUTH: No user token cookie available')
    if (!process.env.JWT_SECRET) throw new Error('INTERNAL: No JWT secret environment variable found')

    const { email } = verifyTokenCookie(req.cookies.token)

    const { client } = await connectToDatabase()
    const allFiles: File[] = await client.db('data').collection('documents').find({ collaborators: email }).toArray()
    const recentFiles: File[] = await client.db('data').collection('documents').find({ collaborators: email }).toArray()

    res.status(200).json({ allFiles, recentFiles })
  } catch (error) {
    console.error(error)
    res.status(401).json({ user: null, message: 'User is not authenticated!' })
  }
}
