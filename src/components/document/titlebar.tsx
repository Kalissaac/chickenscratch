import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ChevronLeft, Info } from '@kalissaac/react-feather'
import { SkeletonLine } from '@components/skeleton'
import type ParchmentDocument from '@interfaces/document'

export default function DocumentTitlebar ({ setSidebarOpen, activeDocument }: { setSidebarOpen: Function, activeDocument: ParchmentDocument }): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const docTitle = document.getElementById('doctitle') as HTMLInputElement | null
    if (docTitle && activeDocument && activeDocument.title !== 'Untitled Document') {
      docTitle.setAttribute('value', activeDocument.title)
      docTitle.size = Math.max(docTitle.value.length || docTitle.placeholder.length, 10)
    }
  }, [activeDocument?.title])

  return (
    <div className='sticky top-0 z-10 p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 bg-opacity-80' style={{ backdropFilter: 'blur(8px)' }}>
      <button className='self-stretch flex justify-center items-center ml-4' onClick={() => router.back()}><ChevronLeft /></button>
      {activeDocument
        ? <input id='doctitle' type='text' className='text-center font-serif outline-none bg-transparent focus:outline-none focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all' placeholder='Untitled Document' onChange={(e) => { document.title = e.currentTarget.value + ' | Parchment'; e.currentTarget.size = Math.max(e.currentTarget.value.length, 10) }} />
        : <SkeletonLine className='animate-pulse h-5 w-1/4 my-2' />
      }
      {activeDocument
        ? <button className='self-stretch flex justify-center items-center mr-4' onClick={() => setSidebarOpen(true)}><Info /></button>
        : <SkeletonLine className='animate-pulse h-5 w-5 self-center rounded-full mr-4' />
      }
    </div>
  )
}
