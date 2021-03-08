import Slideover from '@components/slideover'
import { Listbox, Transition } from '@headlessui/react'
import { Archive, Check, ChevronDown, Eye, MessageSquare, Plus, Shield, ThumbsUp, Trash, User, X } from '@kalissaac/react-feather'
import { useRouter } from 'next/router'
import { ReactNode, useContext, useState } from 'react'
import ParchmentEditorContext from '@components/document/editor/context'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen }: { setSidebarOpen: Function, sidebarOpen: boolean }): JSX.Element {
  const router = useRouter()
  const [activeDocument, documentAction] = useContext(ParchmentEditorContext)
  const [fileFolder, setFileFolder] = useState('folder 1')

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
            <Listbox
              as="div"
              className="space-y-1"
              value={fileFolder}
              onChange={setFileFolder}
            >
              {({ open }) => (
                <>
                  {/* <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                    Assigned to
                  </Listbox.Label> */}
                  <div className="relative">
                    <span className="inline-block w-full rounded-md shadow-sm">
                      <Listbox.Button className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-accent-1-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                        <span className="block truncate">{fileFolder}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown />
                        </span>
                      </Listbox.Button>
                    </span>

                    <Transition
                      show={open}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                    >
                      <Listbox.Options
                        static
                        className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                      >
                        {['folder 1', 'folder 2', 'folder 3', 'folder 4', 'folder 5', 'folder 6', 'folder 7'].map((person) => (
                          <Listbox.Option key={person} value={person}>
                            {({ selected, active }) => (
                              <div
                                className={`${
                                  active
                                    ? 'text-white bg-accent-1-500'
                                    : 'text-gray-900'
                                } cursor-default select-none relative py-2 pl-8 pr-4`}
                              >
                                <span
                                  className={`${
                                    selected ? 'font-semibold' : 'font-normal'
                                  } block truncate`}
                                >
                                  {person}
                                </span>
                                {selected && (
                                  <span
                                    className={`${
                                      active ? 'text-white' : 'text-accent-1-500'
                                    } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                  >
                                    <Check />
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </Field>

          <Field title='Google Drive'>
            <Listbox
              as="div"
              className="space-y-1 z-0"
              value={fileFolder}
              onChange={setFileFolder}
            >
              {({ open }) => (
                <>
                  {/* <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                    Assigned to
                  </Listbox.Label> */}
                  <div className="relative">
                    <span className="inline-block w-full rounded-md shadow-sm">
                      <Listbox.Button className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-accent-1-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                        <span className="block truncate">{fileFolder}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown />
                        </span>
                      </Listbox.Button>
                    </span>

                    <Transition
                      show={open}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                    >
                      <Listbox.Options
                        static
                        className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                      >
                        {['folder 1', 'folder 2', 'folder 3', 'folder 4', 'folder 5', 'folder 6', 'folder 7'].map((person) => (
                          <Listbox.Option key={person} value={person}>
                            {({ selected, active }) => (
                              <div
                                className={`${
                                  active
                                    ? 'text-white bg-accent-1-500'
                                    : 'text-gray-900'
                                } cursor-default select-none relative py-2 pl-8 pr-4`}
                              >
                                <span
                                  className={`${
                                    selected ? 'font-semibold' : 'font-normal'
                                  } block truncate`}
                                >
                                  {person}
                                </span>
                                {selected && (
                                  <span
                                    className={`${
                                      active ? 'text-white' : 'text-accent-1-500'
                                    } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                  >
                                    <Check />
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
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
