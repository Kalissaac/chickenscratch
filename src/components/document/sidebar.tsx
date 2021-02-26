import Slideover from '@components/slideover'
import type ParchmentDocument from '@interfaces/document'
import { Archive, Plus, Trash, X } from '@kalissaac/react-feather'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen }: { setSidebarOpen: Function, sidebarOpen: boolean }): JSX.Element {
  const router = useRouter()
  const { data: pageData } = useSWR(`/api/document/get?id=${router.query.document as string}`)
  const activeDocument: ParchmentDocument = pageData?.document

  return (
    <Slideover slideoverOpen={sidebarOpen} setSlideoverOpen={setSidebarOpen}>
      {activeDocument &&
        <>
          <header className=''>
            <h2 className='text-lg leading-7 font-semibold'>
              {activeDocument.title}
            </h2>
          </header>
          <div className=''>
            Collaborators:
            <ol className='space-y-2'>
              {activeDocument.collaborators.map(collaborator => (
                <li><button className='flex items-center hover:text-gray-300'>{collaborator.user} ({collaborator.role}) <X className='ml-1' /></button></li>
              ))}
              <li><button className='flex items-center hover:text-gray-300'><Plus className='mr-1' /> Add collaborator</button></li>
            </ol>
            <h3 className='uppercase font-medium mt-4'>Tags:</h3>
            <ol className='space-y-2'>
              {activeDocument.tags.map(tag => (
                <li><button className='flex items-center hover:text-gray-300'>{tag} <X className='ml-1' /></button></li>
              ))}
              <li><button className='flex items-center hover:text-gray-300'><Plus className='mr-1' /> Add tag</button></li>
            </ol>
          </div>
          <div className='flex'>
            <button className='basis flex-1 bg-red-500 hover:bg-red-600 text-gray-50 focus:border-black p-2 px-4 flex justify-center items-center' title='Delete document' onClick={() => { fetch(`/api/document/delete?id=${activeDocument._id}`).then(r => r.status === 200 && router.push('/home')).catch(console.error) }}><Trash className='mr-2' /> Delete Document</button>
            <button className='basis ml-4 w-12 h-12 bg-gray-500 hover:bg-gray-600 text-gray-50 focus:border-black p-2 flex justify-center items-center' title='Archive document' onClick={() => { fetch(`/api/document/archive?id=${activeDocument._id}`).then(r => r.status === 200 && router.push('/home')).catch(console.error) }}><Archive /></button>
          </div>
        </>
      }
    </Slideover>
  )
}
