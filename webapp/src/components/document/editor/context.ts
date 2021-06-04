import type ParchmentDocument from '@interfaces/document'
import { createContext, useReducer } from 'react'
import type { Dispatch } from 'react'

const ParchmentEditorContext = createContext<[ParchmentDocument, Dispatch<DocumentAction>] | []>([])

export default ParchmentEditorContext

export function createDocumentValue (initalDocument: ParchmentDocument): [ParchmentDocument, Dispatch<DocumentAction>] {
  return useReducer(documentReducer, initalDocument)
}

export interface DocumentAction {
  type: string
  payload: any
}

function documentReducer (document: ParchmentDocument, action: DocumentAction): ParchmentDocument {
  switch (action.type) {
    case 'setTitle':
      return {
        ...document,
        title: action.payload
      }
    case 'setBody':
      return {
        ...document,
        body: action.payload
      }
    case 'addCollaborator': {
      const collaborators = document.collaborators.slice()
      collaborators.push(action.payload)
      return {
        ...document,
        collaborators
      }
    }
    case 'removeCollaborator': {
      const collaborators = document.collaborators.slice()
      collaborators.splice(collaborators.map(c => c.user).indexOf(action.payload), 1)
      return {
        ...document,
        collaborators
      }
    }
    case 'addTag': {
      const tags = document.tags.slice()
      tags.push(action.payload)
      return {
        ...document,
        tags
      }
    }
    case 'removeTag': {
      const tags = document.tags.slice()
      tags.splice(tags.indexOf(action.payload), 1)
      return {
        ...document,
        tags
      }
    }
    case 'setDue':
      return {
        ...document,
        due: action.payload
      }
    case 'dangerouslyOverwrite':
      return action.payload
    default:
      return document
  }
}
