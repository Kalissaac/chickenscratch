import Slideover from '@components/slideover'
import { Listbox } from '@headlessui/react'
import { Archive, Eye, MessageSquare, Plus, Shield, ThumbsUp, Trash, User, X } from '@kalissaac/react-feather'
import { useRouter } from 'next/router'
import { ReactNode, useContext } from 'react'
import ParchmentEditorContext from '@components/document/editor/context'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen }: { setSidebarOpen: Function, sidebarOpen: boolean }): JSX.Element {
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
                <li key={collaborator.user}><button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400' title={`${collaborator.user} (${collaborator.role})`}><CollaboratorIcon role={collaborator.role} /> {collaborator.user}<X className='ml-1' /></button></li>
              ))}
              <li><button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400'><Plus className='mr-1' /> Add collaborator</button></li>
            </ol>
          </Field>

          <Field title='Tags'>
            <ol className='space-y-2'>
              {activeDocument.tags.map(tag => (
                <li key={tag}><button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400'>{tag} <X className='ml-1' /></button></li>
              ))}
              <li><button className='flex items-center hover:text-gray-500 dark:hover:text-gray-400'><Plus className='mr-1' /> Add tag</button></li>
            </ol>
          </Field>

          <Field title='Due Date'>
            <input type="datetime-local" name="duedate" id="duedate" value={activeDocument.due ?? ''} onChange={e => {
              if (!e.target || !e.target.value) return
              documentAction({
                type: 'setDate',
                payload: e.target.value
              })
            }} className='bg-transparent' />
          </Field>

          <Field title='Folder'>
            {/* <Listbox value={selectedPerson} onChange={setSelectedPerson}>
              <Listbox.Button>{selectedPerson.name}</Listbox.Button>
              <Listbox.Options>
                {people.map(person => (
                  <Listbox.Option key={person.id} value={person} disabled={person.unavailable}>
                    {person.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox> */}
            select a folder
          </Field>

          <Field title='Google Drive'>
            linked file here
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

function CollaboratorIcon ({ role }: { role: string}): JSX.Element {
  const className = 'mr-1'
  switch (role) {
    case 'editor':
      return <User className={className}/>
    case 'viewer':
      return <Eye className={className}/>
    case 'owner':
      return <Shield className={className}/>
    case 'commentor':
      return <MessageSquare className={className}/>
    case 'suggestor':
      return <ThumbsUp className={className}/>
    default:
      return <User className={className}/>
  }
}
