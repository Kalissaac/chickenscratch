import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { responseHandler } from '@shared/error'
import User from '@interfaces/user'

export default async function GetTag (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (!req.cookies.token) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }

    const tagID = req.query.id
    if (!tagID) {
      error.name = 'NO_ID_SPECIFIED'
      error.message = 'No tag ID was specified in the request'
      throw error
    }

    const { email, publicAddress } = await verifyTokenCookie(req.cookies.token)
    if (!email) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()

    const user = await client.db('data').collection('users').findOne({ _id: publicAddress }) as User
    if (!user) {
      error.name = 'USER_NOT_FOUND'
      error.message = 'No user found in MongoDB with id: ' + publicAddress
      throw error
    }

    const tagFiles: ParchmentDocument[] = await client.db('data').collection('documents')
      .find({ collaborators: { $elemMatch: { user: email } }, tags: tagID, deleted: { $exists: false }, archived: false })
      .project({ body: 0 })
      .toArray()
    if (!tagFiles) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate all documents for user with userId: ' + email
      throw error
    }

    res.json({ tag: user.tags[tagID as string], files: tagFiles })
  } catch (error) {
    responseHandler(error, res)
  }
}
