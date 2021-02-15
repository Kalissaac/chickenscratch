import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'

export default async function CreateDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const user = verifyTokenCookie(req.cookies.token)
    if (user === '') throw new Error('Not authenticated')
    const { client } = await connectToDatabase()
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
