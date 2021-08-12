import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenCookie } from '@shared/cookies'
import { connectToDatabase } from '@shared/mongo'
import type ParchmentDocument from '@interfaces/document'
import { responseHandler } from '@shared/error'

export default async function GetCommonCollaborators (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const error = new Error()
  try {
    if (!req.cookies.token) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'No authentication token provided'
      throw error
    }

    const { email: userId } = await verifyTokenCookie(req.cookies.token)
    if (!userId) {
      error.name = 'USER_NOT_AUTHENTICATED'
      error.message = 'User data could not be decoded from JWT'
      throw error
    }

    const { client } = await connectToDatabase()

    /*
      1. Find all documents with user as a collaborator in them
      2. Collect list of all common collaborator ids
      3. Get profile for each of the collaborators
    */

    const allFiles: ParchmentDocument[] = await client.db('data').collection('documents')
      .find({ collaborators: { $elemMatch: { user: userId } }, deleted: { $exists: false }, archived: false }, { projection: { collaborators: 1 } })
      .toArray()
    if (!allFiles) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate all documents for user with userId: ' + userId
      throw error
    }

    const uniqueCollaborators = new Set(allFiles.flatMap(d => {
      return d.collaborators.map(c => c.user)
    }))
    uniqueCollaborators.delete(userId)

    const commonCollaboratorProfiles = await client.db('data').collection('users')
      .find({ email: { $in: Array.from(uniqueCollaborators) } }, { projection: { _id: 1, name: 1, email: 1 } })
      .toArray()
    if (!commonCollaboratorProfiles) {
      error.name = 'FILE_NOT_FOUND'
      error.message = 'MongoDB failed to locate all documents for user with userId: ' + userId
      throw error
    }

    res.json({ users: commonCollaboratorProfiles })
  } catch (error) {
    responseHandler(error, res)
  }
}
