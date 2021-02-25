import type { Node } from 'slate'

enum CollaboratorRole {
  Viewer = 'viewer',
  Editor = 'editor',
  Commentor = 'commentor',
  Suggestor = 'suggestor',
  Owner = 'owner'
}

export default interface ParchmentDocument {
  _id: string
  title: string
  created: string
  lastModified: string
  body: Node[]
  collaborators: Array<{
    user: string
    role: CollaboratorRole
  }>
  tags: string[]
  due?: string
  public?: boolean
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
