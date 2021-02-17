import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'

export default async function CreateDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const user = await verifyTokenCookie(req.cookies.token)
    const { client } = await connectToDatabase()
    const newFileRef = await client.db('data').collection('documents').insertOne({
      title: '',
      body: '',
      lastModified: new Date(),
      collaborators: [user.email]
    })
    res.status(200).json({ document: { _id: newFileRef.insertedId } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.name })
  }
}
