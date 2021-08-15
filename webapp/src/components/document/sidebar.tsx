import Slideover from '@components/slideover'
import { Transition } from '@headlessui/react'
import { Archive, Check, ChevronDown, CornerDownLeft, Eye, MessageSquare, Shield, ThumbsUp, Trash, User as UserIcon, X } from '@kalissaac/react-feather'
import { useRouter } from 'next/router'
import { ReactNode, useContext, useState } from 'react'
import ParchmentEditorContext, { DocumentActionTypes } from '@components/document/editor/context'
import { EditorModes } from '@components/document/editor'
import Image from 'next/image'
import useSWR from 'swr'
import User from '@interfaces/user'
import { useUser } from '@shared/hooks'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen, mode }: { setSidebarOpen: Function, sidebarOpen: boolean, mode: EditorModes }): JSX.Element {
  const router = useRouter()
  const [activeDocument, documentAction] = useContext(ParchmentEditorContext)
  const { user } = useUser()
  const { data: commonCollaborators } = useSWR<{ users: User[] }>('/api/user/commonCollaborators')

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
                <li key={collaborator.user}>
                  <button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400 disabled:hover:text-current disabled:cursor-default group' title={`${collaborator.user} (${collaborator.role})`} disabled={collaborator.user === user.email} onClick={() => { documentAction({ type: 'removeCollaborator', payload: collaborator }) }}>
                    <CollaboratorIcon role={collaborator.role} /> {collaborator.user} <X className='ml-1 opacity-0 group-hover:opacity-100 group-disabled:group-hover:opacity-0 transition-opacity' />
                  </button>
                </li>
              ))}
              {mode === EditorModes.Editing &&
                <li><FieldInput action='addCollaborator' placeholder='+ Add collaborator' type='email' choiceList={
                  (commonCollaborators?.users && commonCollaborators.users.map(collaborator => (
                    <li key={collaborator._id}>
                      <button className='w-full flex items-center p-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors' onClick={() => { documentAction({ type: 'addCollaborator', payload: { user: collaborator.email, role: 'editor' } }) }}>
                        <Image src='/images/user.jpg' width={32} height={32} className='rounded-full bg-gradient-to-b from-gray-500 to-gray-600' />
                        <div className='ml-4 text-left'>
                          <div className='font-medium leading-none'>{collaborator.name}</div>
                          <div className='text-sm text-gray-700 dark:text-gray-300'>{collaborator.email}</div>
                        </div>
                      </button>
                    </li>
                  )))
                }
                /></li>
              }
            </ol>
          </Field>

          <Field title='Tags'>
            <ol className='space-y-2'>
              {activeDocument.tags.map(tag => (
                <li key={tag}>
                  <button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400 group' title={tag} onClick={() => { documentAction({ type: 'removeTag', payload: tag }) }}>
                    <span className='bg-gray-600 group-hover:opacity-80 h-3 w-3 rounded-full mr-2' /> {tag} <X className='ml-1 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </button>
                </li>
              ))}
              {mode === EditorModes.Editing &&
                <li><FieldInput action='addTag' placeholder='+ Add tag' choiceList={
                  Object.entries(user.tags).map(([tagId, tag]) => (
                    <li key={tagId}>
                      <button className='w-full flex items-center p-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors' onClick={() => { documentAction({ type: 'addTag', payload: tagId }) }}>
                        <span className='bg-gray-600 h-2 w-2 rounded-full mr-2' style={{ backgroundColor: tag.color }} />
                        <div className='ml-2'>
                          {tag.name}
                        </div>
                      </button>
                    </li>
                  ))}
                /></li>
              }
            </ol>
          </Field>

          <Field title='Due Date'>
            <FieldInput placeholder='YYYY-MM-DDTHH:MM:SS' action='setDue' type='datetime-local' managedValue={activeDocument.due ?? ''} enterPrompt={false} disabled={mode !== EditorModes.Editing} />
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
    <div className='relative'>
      <h3 className='font-medium text-sm uppercase text-gray-700 dark:text-gray-300 mb-2'>{title}</h3>
      {children}
    </div>
  )
}

function FieldInput ({ action, placeholder, type = 'text', managedValue, disabled = false, enterPrompt = true, choiceList }: { action: DocumentActionTypes, placeholder: string, type?: string, managedValue?: string, disabled?: boolean, enterPrompt?: boolean, choiceList?: ReactNode }): JSX.Element {
  const [, documentAction] = useContext(ParchmentEditorContext)
  const [showEnterPrompt, setShowEnterPrompt] = useState(false)
  const [showChoiceList, setShowChoiceList] = useState(false)

  return (
    <div className='focus-within:border-gray-800 dark:focus-within:border-gray-50 border-transparent border-b-2 w-full transition-colors flex group'>
      <input
        type={type}
        className='field-input outline-none bg-transparent w-full transition-all flex-1'
        placeholder={placeholder}
        value={managedValue}
        disabled={disabled}
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
          if (!managedValue) e.currentTarget.value = ''
        }}
        // TODO: Check onChange for performance issues regarding adding classes like this
        onChange={e => {
          if (e.currentTarget.value) {
            setShowEnterPrompt(true)
          } else {
            setShowEnterPrompt(false)
          }

          if (managedValue !== undefined && documentAction) {
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
          }
        }}
        onFocus={e => {
          if (e.currentTarget.value) {
            setShowEnterPrompt(true)
          }
          setShowChoiceList(true)
        }}
        onBlur={() => {
          setShowEnterPrompt(false)
          setShowChoiceList(false)
        }}
      />
      <Transition
        show={enterPrompt && showEnterPrompt}
        enter='transition-opacity duration-75'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-75'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
        as='button'
        className='text-gray-600 dark:text-gray-400 p-0.5 px-2 text-xs flex items-center'
      >
        <CornerDownLeft className='mr-1' /> Enter
      </Transition>

      <Transition
        show={(choiceList && showChoiceList) === true}
        enter='transition-opacity duration-200'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-150'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
        as='ol'
        className='absolute left-0 right-0 top-full max-h-[33vh] overflow-auto bg-white dark:bg-gray-800 shadow-2xl drop-shadow-xl rounded-b-md z-10'
      >
        {choiceList}
      </Transition>
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
      return <UserIcon className={className}/>
  }
}
