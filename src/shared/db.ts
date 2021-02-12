import { MongoClient } from 'mongodb'

const client = new MongoClient('')

export function useDB (): MongoClient {
  return client
}
