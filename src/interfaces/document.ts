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

export function compareDocuments (documentA: ParchmentDocument, documentB: ParchmentDocument): boolean {
  return (
    documentA.title === documentB.title &&
    documentA.lastModified === documentB.lastModified &&
    documentA.body === documentB.body &&
    documentA.collaborators === documentB.collaborators &&
    documentA.tags === documentB.tags &&
    documentA.due === documentB.due
  )
}
