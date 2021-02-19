import type { Node } from 'slate'

export default interface ParchmentDocument {
  _id: string
  title: string
  lastModified: string
  body: Node[]
  collaborators: string[]
  tags: string[]
  due?: string
}
