import Slideover from '@components/slideover'
import { Archive, CornerDownLeft, Eye, MessageSquare, Shield, ThumbsUp, Trash, User, X } from '@kalissaac/react-feather'
import { useRouter } from 'next/router'
import { ReactNode, useContext, useRef } from 'react'
import ParchmentEditorContext, { DocumentActionTypes } from '@components/document/editor/context'
import { EditorModes } from '@components/document/editor'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen, mode }: { setSidebarOpen: Function, sidebarOpen: boolean, mode: EditorModes }): JSX.Element {
  const router = useRouter()
  const [activeDocument, documentAction] = useContext(ParchmentEditorContext)

  return (
    <Slideover slideoverOpen={sidebarOpen} setSlideoverOpen={setSidebarOpen}>
      {activeDocument && documentAction &&
        <>
          <h2 className='text-2xl font-serif tracking-wide font-semibold'>
            {activeDocument.title}
          </h2>

          <Field title='Collaborators'>
            <ol className='space-y-2'>
              {activeDocument.collaborators.map(collaborator => (
                <li key={collaborator.user}><button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400 group' title={`${collaborator.user} (${collaborator.role})`} onClick={() => { documentAction({ type: 'removeCollaborator', payload: collaborator }) }}><CollaboratorIcon role={collaborator.role} /> {collaborator.user} <X className='ml-1 opacity-0 group-hover:opacity-100 transition-opacity' /></button></li>
              ))}
              {mode === EditorModes.Editing &&
              <li><FieldInput action='addCollaborator' placeholder='+ Add collaborator' type='email' /></li>
              }
            </ol>
          </Field>

          <Field title='Tags'>
            <ol className='space-y-2'>
              {activeDocument.tags.map(tag => (
                <li key={tag}><button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400 group' title={tag} onClick={() => { documentAction({ type: 'removeTag', payload: tag }) }}><span className='bg-gray-600 group-hover:opacity-80 h-3 w-3 rounded-full mr-2' /> {tag} <X className='ml-1 opacity-0 group-hover:opacity-100 transition-opacity' /></button></li>
              ))}
              {mode === EditorModes.Editing &&
              <li><FieldInput action='addTag' placeholder='+ Add tag' /></li>
              }
            </ol>
          </Field>

          <Field title='Due Date'>
            <input type="datetime-local" name="duedate" id="duedate" placeholder='YYYY-MM-DDTHH:MM:SS' value={activeDocument.due ?? ''} onChange={e => {
              if (!e.target || !e.target.value) return
              documentAction({
                type: 'setDue',
                payload: e.target.value
              })
            }} className='bg-transparent' disabled={mode !== EditorModes.Editing} />
          </Field>

          <Field title='Publicly Viewable'>
            <input type="checkbox" name="public" id="public" checked={activeDocument.public} onChange={e => {
              documentAction({
                type: 'setPublic',
                payload: e.target.checked
              })
            }} className='bg-transparent' disabled={mode !== EditorModes.Editing} />
          </Field>

          <div className='flex pt-8' style={{ marginTop: 'auto' }}>
            <button className='basis flex-1 bg-red-500 hover:bg-red-600 text-gray-50 focus:border-black p-2 px-4 flex justify-center items-center' title='Delete document' onClick={() => { fetch(`/api/document/delete?id=${activeDocument._id}`).then(r => r.ok && router.push('/home')).catch(console.error) }}><Trash className='mr-2' /> Delete Document</button>
            <button className='basis ml-4 w-12 h-12 bg-gray-500 hover:bg-gray-600 text-gray-50 focus:border-black p-2 flex justify-center items-center' title='Archive document' onClick={() => { fetch(`/api/document/archive?id=${activeDocument._id}`).then(r => r.ok && router.push('/home')).catch(console.error) }}><Archive /></button>
          </div>
        </>
      }
    </Slideover>
  )
}

function Field ({ title, children }: { title: string, children: ReactNode }): JSX.Element {
  return (
    <div>
      <h3 className='font-medium text-sm uppercase text-gray-700 dark:text-gray-300 mb-2'>{title}</h3>
      {children}
    </div>
  )
}

function FieldInput ({ action, placeholder, type = 'text' }: { action: DocumentActionTypes, placeholder: string, type?: string }): JSX.Element {
  const [, documentAction] = useContext(ParchmentEditorContext)
  const enterPromptRef = useRef<HTMLButtonElement>(null)

  return (
    <div className='focus-within:border-gray-800 dark:focus-within:border-gray-50 border-transparent border-b-2 w-full transition-colors flex group'>
      <input
        type={type}
        className='field-input outline-none bg-transparent w-full transition-all flex-1'
        placeholder={placeholder}
        onKeyPress={e => {
          if (e.code !== 'Enter') return
          if (!documentAction) return
          const value = e.currentTarget.value
          if (!value) return
          let payload: string | object

          switch (action) {
            case 'addCollaborator':
              payload = {
                user: value,
                role: 'editor'
              }
              break
            default:
              payload = value
          }

          documentAction({ type: action, payload })
          e.currentTarget.value = ''
        }}
        // TODO: Check onChange for performance issues regarding adding classes like this
        onChange={e => {
          if (e.currentTarget.value) {
            enterPromptRef.current?.classList.add('flex')
            enterPromptRef.current?.classList.remove('hidden')
          } else {
            enterPromptRef.current?.classList.add('hidden')
            enterPromptRef.current?.classList.remove('flex')
          }
        }}
        onFocus={e => {
          if (e.currentTarget.value) {
            enterPromptRef.current?.classList.add('flex')
            enterPromptRef.current?.classList.remove('hidden')
          }
        }}
        onBlur={() => {
          enterPromptRef.current?.classList.add('hidden')
          enterPromptRef.current?.classList.remove('flex')
        }}
      />
      <button ref={enterPromptRef} className='text-gray-600 dark:text-gray-400 p-0.5 px-2 text-xs items-center hidden'><CornerDownLeft className='mr-1' /> Enter</button>
    </div>
  )
}

function CollaboratorIcon ({ role }: { role: string}): JSX.Element {
  const className = 'mr-1'
  switch (role) {
    case 'viewer':
      return <Eye className={className}/>
    case 'owner':
      return <Shield className={className}/>
    case 'commentor':
      return <MessageSquare className={className}/>
    case 'suggestor':
      return <ThumbsUp className={className}/>
    case 'editor':
    default:
      return <User className={className}/>
  }
}
