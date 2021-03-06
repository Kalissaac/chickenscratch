import { MongoClient, Db } from 'mongodb'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable not found!')
if (!MONGODB_DB) throw new Error('MONGODB_DB environment variable not found!')

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      mongo: any
    }
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase (): Promise<{ client: MongoClient, db: Db }> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    cached.promise = MongoClient.connect(MONGODB_URI ?? '', opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB)
      }
    }).catch(e => {
      throw new Error(e)
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
