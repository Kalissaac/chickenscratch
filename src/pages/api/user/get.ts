import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { responseHandler } from '@shared/error'

export default async function GetUserInfo (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    const userID = req.query.id as string
    if (!userID) {
      error.name = 'NO_ID_SPECIFIED'
      error.message = 'No user ID was specified in the request'
      throw error
    }

    const user = await verifyTokenCookie(req.cookies.token)
    if (!user) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()

    const requestedUser = await client.db('data').collection('users').findOne({
      _id: userID,
      deleted: { $exists: false }
    }, { projection: { _id: 1, name: 1, email: 1 } })
    if (!requestedUser) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate user with ID: ' + userID
      throw error
    }

    const commonFiles = await client.db('data').collection('documents')
      .find({ 'collaborators.user': { $in: [user.publicAddress, requestedUser.email] }, deleted: { $exists: false }, archived: false }, { projection: { body: 0 } })
      .toArray() as ParchmentDocument[]
    if (!commonFiles) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate user with ID: ' + userID
      throw error
    }

    res.json({ user: requestedUser, commonFiles })
  } catch (error) {
    responseHandler(error as Error, res)
  }
}
