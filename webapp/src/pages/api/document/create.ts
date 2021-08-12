import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import { responseHandler } from '@shared/error'

export default async function CreateDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    const newFileRef = await client.db('data').collection('documents').insertOne({
      title: 'Untitled Document',
      body: [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }],
      created: new Date(),
      lastModified: new Date(),
      collaborators: [{
        user: user.email,
        role: 'owner'
      }],
      tags: [],
      public: false,
      archived: false
    })
    if (!newFileRef.acknowledged) {
      error.name = 'UNKNOWN_ERROR'
      error.message = 'MongoDB could not create document'
      throw error
    }

    res.json({ document: { _id: newFileRef.insertedId } })
  } catch (error) {
    responseHandler(error, res)
  }
}
