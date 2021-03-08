import { useRouter } from 'next/router'
import { useContext, useEffect, useRef } from 'react'
import { ChevronLeft, Info } from '@kalissaac/react-feather'
import { SkeletonLine } from '@components/skeleton'
import ParchmentEditorContext from './editor/context'

export default function DocumentTitlebar ({ setSidebarOpen }: { setSidebarOpen: Function }): JSX.Element {
  const router = useRouter()
  const [activeDocument, documentAction] = useContext(ParchmentEditorContext)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (titleInputRef.current && activeDocument && activeDocument?.title !== 'Untitled Document') {
      titleInputRef.current.setAttribute('value', activeDocument.title)
      titleInputRef.current.size = Math.max(titleInputRef.current.value.length || titleInputRef.current.placeholder.length, 10)
    }
  }, [activeDocument?.title])

  return (
    <div className='sticky top-0 z-10 p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 bg-opacity-80' style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <button className='self-stretch flex justify-center items-center ml-4' aria-label='Back button' onClick={() => router.back()}><ChevronLeft aria-label='Left arrow' /></button>
      {(activeDocument && documentAction)
        ? <input id='doctitle' ref={titleInputRef} type='text' className='text-center font-serif outline-none bg-transparent focus:outline-none focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all' placeholder='Untitled Document'
            onChange={({ currentTarget: input }) => {
              document.title = input.value + ' | Parchment'; input.size = Math.max(input.value.length, 10)
              documentAction({
                type: 'setTitle',
                payload: input.value
              })
            }}
          />
        : <SkeletonLine className='animate-pulse h-5 w-1/4 my-2' />
      }
      {activeDocument
        ? <button className='self-stretch flex justify-center items-center mr-4' aria-label='Document information button' onClick={() => setSidebarOpen(true)}><Info aria-label='Info icon' /></button>
        : <SkeletonLine className='animate-pulse h-5 w-5 self-center rounded-full mr-4' />
      }
    </div>
  )
}
