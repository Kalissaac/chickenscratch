import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type File from '@interfaces/file'
import { ObjectId } from 'mongodb'

export default async function GetDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
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
      error.message = 'User email could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    const requestedDocument: File = await client.db('data').collection('documents').findOne({ _id: ObjectId.createFromHexString(documentID) })
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

    res.status(200).json({ document: requestedDocument })
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
