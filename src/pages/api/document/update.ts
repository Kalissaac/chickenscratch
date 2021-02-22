import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { ObjectId } from 'mongodb'
import { responseHandler } from '@shared/error'

export default async function UpdateDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const requestBody = JSON.parse(req.body)
    const documentID = requestBody.id as string
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
    const requestedDocument: ParchmentDocument = await client.db('data').collection('documents').findOne({ _id: ObjectId.createFromHexString(documentID) })
    if (!requestedDocument) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate document with ID: ' + documentID
      throw error
    }
    if (!requestedDocument.collaborators.includes(user.email)) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'User not authorized to access document with ID: ' + documentID
      throw error
    }

    const updateRequest = await client.db('data').collection('documents').updateOne({ _id: ObjectId.createFromHexString(documentID) }, { $set: { ...requestBody.document, lastModified: new Date() } })
    if (updateRequest.result.ok !== 1) throw new Error('Database could not update document!')

    res.json({ success: true })
  } catch (error) {
    responseHandler(error, res)
  }
}
