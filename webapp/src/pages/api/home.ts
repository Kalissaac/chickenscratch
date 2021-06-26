import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { responseHandler } from '@shared/error'

export default async function GetHomepageData (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (!req.cookies.token) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }

    const { email } = await verifyTokenCookie(req.cookies.token)
    if (!email) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    const allFiles: ParchmentDocument[] = await client.db('data').collection('documents')
      .find({ collaborators: { $elemMatch: { user: email } }, deleted: { $exists: false }, archived: false }, { projection: { body: 0 } })
      .collation({ locale: 'en' })
      .sort({ title: 1 })
      .toArray()
    if (!allFiles) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate all documents for user with email: ' + email
      throw error
    }

    const recentFiles: ParchmentDocument[] = await client.db('data').collection('documents')
      .find({ collaborators: { $elemMatch: { user: email } }, deleted: { $exists: false }, archived: false })
      .sort({ lastModified: -1 })
      .limit(5)
      .toArray()
    if (!recentFiles) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate recent documents for user with email: ' + email
      throw error
    }

    res.json({ allFiles, recentFiles })
  } catch (error) {
    responseHandler(error, res)
  }
}
