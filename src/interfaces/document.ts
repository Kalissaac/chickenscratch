import type { Node } from 'slate'
import type Collaborator from '@interfaces/collaborator'

export default interface ParchmentDocument {
  _id: string
  title: string
  created: string
  lastModified: string
  body: Node[]
  collaborators: Collaborator[]
  tags: string[]
  due?: string
  access: AccessLevels
  deleted?: string
  archived: boolean
  integrations: {
    googleDrive: string // linked google drive file
  }
}

export enum AccessLevels {
  private = 'private',
  unlisted = 'unlisted',
  public = 'public'
}

export function compareDocuments (documentA: ParchmentDocument, documentB: ParchmentDocument): boolean {
  // Real shitty comparison method, TODO: need to find a better way of comparing differences between documents
  return (
    documentA.title === documentB.title &&
    documentA.lastModified === documentB.lastModified &&
    documentA.body === documentB.body &&
    documentA.collaborators === documentB.collaborators &&
    documentA.tags === documentB.tags &&
    documentA.due === documentB.due &&
    documentA.access === documentB.access
  )
}
