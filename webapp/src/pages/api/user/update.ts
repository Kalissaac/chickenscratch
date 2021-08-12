import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { responseHandler } from '@shared/error'

export default async function UpdateDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const requestBody = JSON.parse(req.body)
    if (!requestBody.user) {
      error.name = 'NO_BODY'
      error.message = 'No user to update was specified in the request'
      throw error
    }

    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()
    const requestedUser = await client.db('data').collection('users').findOne({ _id: user.publicAddress }) as ParchmentDocument
    if (!requestedUser) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate user with ID: ' + user.publicAddress
      throw error
    }

    const updateRequest = await client.db('data').collection('users').updateOne({ _id: user.publicAddress }, { $set: { ...requestBody.user, lastModified: new Date() } })
    if (!updateRequest.acknowledged) throw new Error('Database could not update document!')

    res.json({ success: true })
  } catch (error) {
    responseHandler(error, res)
  }
}
