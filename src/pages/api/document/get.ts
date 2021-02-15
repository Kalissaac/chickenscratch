import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type File from '@interfaces/file'
import { ObjectId } from 'mongodb'

export default async function GetDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const documentID = req.query.id as string
  try {
    const user = await verifyTokenCookie(req.cookies.token)
    const { client } = await connectToDatabase()
    const requestedDocument: File = await client.db('data').collection('documents').findOne({ _id: ObjectId.createFromHexString(documentID) })
    if (!requestedDocument.collaborators.includes(user.email)) throw new Error('User not authorized or document doesn\'t exist!')
    res.status(200).json({ document: requestedDocument })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
