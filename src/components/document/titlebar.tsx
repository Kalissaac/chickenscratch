import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ChevronLeft, Info } from '@kalissaac/react-feather'

export default function DocumentTitlebar ({ setSidebarOpen, activeDocument }: { setSidebarOpen: Function, activeDocument: any }): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const docTitle = document.getElementById('doctitle') as HTMLInputElement | null
    if (docTitle && activeDocument) {
      docTitle.setAttribute('value', activeDocument.title as string)
      docTitle.size = Math.max(docTitle.value.length || docTitle.placeholder.length, 10)
    }
  }, [activeDocument?.title])

  return (
    <div className='p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 opacity-80 skeleton-loader' style={{ backdropFilter: 'blur(24px)' }}>
      <button className='self-stretch flex justify-center items-center' onClick={() => router.back()}><ChevronLeft /></button>
      {activeDocument
        ? <input id='doctitle' type='text' className='text-center font-serif outline-none bg-transparent focus:outline-none focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all' placeholder='Untitled Document' onChange={(e) => { e.currentTarget.size = Math.max(e.currentTarget.value.length, 10) }} />
        : <div className="animate-pulse h-5 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
      }
      {activeDocument
        ? <button className='self-stretch flex justify-center items-center' onClick={() => setSidebarOpen(true)}><Info /></button>
        : <div className="self-stretch animate-pulse h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
      }
    </div>
  )
}
