import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Info } from '@kalissaac/react-feather'
import { SkeletonLine } from '@components/skeleton'
import ParchmentEditorContext from './editor/context'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { EditorModes } from '@components/document/editor'
import Link from 'next/link'

export default function DocumentTitlebar ({ setSidebarOpen, showBackButton = true, mode }: { setSidebarOpen: Function, showBackButton?: boolean, mode: EditorModes }): JSX.Element {
  const router = useRouter()
  const [activeDocument, documentAction] = useContext(ParchmentEditorContext)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [showTitlebar, setShowTitlebar] = useState(true)
  const documentTopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleInputRef.current && activeDocument && activeDocument?.title !== 'Untitled Document') {
      titleInputRef.current.setAttribute('value', activeDocument.title)
      titleInputRef.current.size = Math.max(titleInputRef.current.value.length || titleInputRef.current.placeholder.length, 10)
    }
  }, [activeDocument?.title, titleInputRef.current])

  useEffect(() => {
    if (!documentTopRef.current) return
    const intersection = new IntersectionObserver(([entry]) => {
      setShowTitlebar(entry.isIntersecting)
    }, {
      threshold: [0.1, 1.0]
    })

    intersection.observe(documentTopRef.current)

    return () => {
      intersection.disconnect()
    }
  }, [documentTopRef.current])

  return (
    <>
      <Transition show={showTitlebar} unmount={false} className='sticky top-0 z-10 p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur' id='document_titlebar'
        enter='transition ease-in-out duration-200 transform'
        enterFrom='-translate-y-full'
        enterTo='translate-y-0'
        leave='transition ease-in-out duration-300 transform'
        leaveFrom='translate-y-0'
        leaveTo='-translate-y-full'
      >
        {showBackButton
          ? <button className='self-stretch flex justify-center items-center ml-4' aria-label='Back button' onClick={() => router.back()}><ChevronLeft aria-label='Left arrow' /></button>
          : <Link href='/home' aria-label='Home button'><a className='self-stretch flex justify-center items-center ml-4 relative w-[1em]' ><Image src='/favicon.svg' layout='fill' /></a></Link>
        }
        {(activeDocument && documentAction)
          ? <input
              id='doctitle'
              ref={titleInputRef}
              type='text'
              className='text-center font-serif outline-none bg-transparent focus:outline-none focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all'
              placeholder='Untitled Document'
              disabled={mode !== EditorModes.Editing}
              onChange={({ currentTarget: input }) => {
                document.title = input.value + ' | Parchment'
                input.size = Math.max(input.value.length, 10)
                documentAction({
                  type: 'setTitle',
                  payload: input.value
                })
              }}
            />
          : <SkeletonLine className='animate-pulse h-5 w-1/4 my-2' />
        }
        {activeDocument
          ? <button className='self-stretch flex justify-center items-center mr-4' aria-label='Document information button' onClick={() => setSidebarOpen(true)}>{showBackButton && <Info aria-label='Info icon' />}</button>
          : <SkeletonLine className='animate-pulse h-5 w-5 self-center rounded-full mr-4' />
        }
      </Transition>
      <div ref={documentTopRef} />
    </>
  )
}
