import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'

export default async function GetHomepageData (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (req.cookies.token === '') {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }
    if (!process.env.JWT_SECRET) {
      error.name = 'INTERNAL_SECRET'
      error.message = 'No JWT secret environment variable found'
      throw error
    }

    const { email } = await verifyTokenCookie(req.cookies.token)
    if (req.cookies.token === '') {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User email could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    const allFiles: File[] = await client.db('data').collection('documents').find({ collaborators: email }).toArray()
    if (!allFiles) {
      error.name = 'FILES_NOT_FOUND'
      error.message = 'MongoDB failed to locate all documents for user with email: ' + email
      throw error
    }

    const recentFiles: File[] = await client.db('data').collection('documents').find({ collaborators: email }).toArray()
    if (!recentFiles) {
      error.name = 'FILES_NOT_FOUND'
      error.message = 'MongoDB failed to locate recent documents for user with email: ' + email
      throw error
    }

    res.status(200).json({ allFiles, recentFiles })
  } catch (error) {
    console.error(error)
    res.status(401).json({ user: null, message: error.name })
  }
}
