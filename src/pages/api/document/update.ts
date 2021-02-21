import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { ObjectId } from 'mongodb'

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
      error.message = 'User email could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
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

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    switch (error.name) {
      case 'NO_ID_SPECIFIED':
        res.status(404).json({ error: error.name })
        break
      default:
        res.status(500).json({ error: error.name })
        break
    }
  }
}