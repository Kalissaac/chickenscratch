import type Collaborator from '@interfaces/collaborator'

export default interface Folder {
  name: string
  color: string
  collaborators: Collaborator[]
  files: Array<string | Folder> // either refers to a file id or has another folder inside
}
