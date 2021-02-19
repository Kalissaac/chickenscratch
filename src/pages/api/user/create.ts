import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'

export default async function CreateUser (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    console.log(req.body)
    const { name } = req.body
    if (!name) {
      error.name = 'NO_BODY'
      error.message = 'No name was specified in the request'
      throw error
    }

    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User email could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    await client.db('data').collection('users').insertOne({
      _id: user.publicAddress,
      email: user.email,
      creationDate: new Date(),
      name
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.name })
  }
}
