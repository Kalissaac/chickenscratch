import type { NextApiRequest, NextApiResponse } from 'next'
import mongodb from 'mongodb'

export default async function createDocument (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const documentID = new mongodb.ObjectID()
    res.redirect(`/d/${documentID.toHexString()}/edit`)
    res.end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
