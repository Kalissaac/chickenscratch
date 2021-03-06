import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import { responseHandler } from '@shared/error'

export default async function CreateUser (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const { name } = req.body
    if (!name) {
      error.name = 'NO_BODY'
      error.message = 'No name was specified in the request'
      throw error
    }

    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    const newFileRef = await client.db('data').collection('users').insertOne({
      _id: user.publicAddress,
      email: user.email,
      creationDate: new Date(),
      name,
      tags: {},
      fileStructure: []
    })
    if (newFileRef.result.ok !== 1) {
      error.name = 'UNKNOWN_ERROR'
      error.message = 'MongoDB could not create user document'
      throw error
    }

    res.json({ success: true })
  } catch (error) {
    responseHandler(error, res)
  }
}
