import type Folder from '@interfaces/folder'

export default interface User {
  _id: string
  email: string
  name: string
  creationDate: string
  tags: {
    [name: string]: {
      created: string
      color: string
    }
  }
  fileStructure: Folder[]
}
