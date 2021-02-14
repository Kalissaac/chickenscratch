import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'

export default async function createDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = verifyTokenCookie(req.cookies.token)
  const { client } = await connectToDatabase()
  try {
    const newFileRef = await client.db('data').collection('documents').insertOne({
      title: '',
      body: '',
      lastModified: new Date(),
      collaborators: [user.email]
    })
    res.redirect(`/d/${newFileRef.insertedId as string}/edit`)
    res.end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
