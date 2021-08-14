import type Folder from '@interfaces/folder'

export default interface User {
  _id: string
  email: string
  name: string
  creationDate: string
  tags: {
    [id: string]: {
      name: string
      color: string
    }
  }
  fileStructure: Folder[]
  integrations: {
    [name: string]: {
      accessToken: string
    }
  }
}
