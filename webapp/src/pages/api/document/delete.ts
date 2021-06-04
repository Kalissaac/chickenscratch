import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import { ObjectId } from 'mongodb'
import { responseHandler } from '@shared/error'

export default async function DeleteDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const documentID = req.query.id as string
    if (!documentID) {
      error.name = 'NO_ID_SPECIFIED'
      error.message = 'No document ID was specified in the request'
      throw error
    }

    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    if (Buffer.byteLength(documentID, 'utf-8') !== 24) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'Unable to create ObjectId from ID: ' + documentID
      throw error
    }

    const deletionResult = await client.db('data').collection('documents').updateOne({
      _id: ObjectId.createFromHexString(documentID),
      collaborators: { $elemMatch: { user: user.email, role: 'owner' } },
      deleted: { $exists: false }
    },
    { $set: { deleted: new Date() } })
    if (deletionResult.result.ok !== 1) {
      error.name = 'UNKNOWN_ERROR'
      error.message = 'MongoDB could not delete document with ID: ' + documentID
      throw error
    }

    res.json({ success: true })
  } catch (error) {
    responseHandler(error, res)
  }
}
