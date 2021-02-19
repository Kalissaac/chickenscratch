import Slideover from '@components/slideover'
import { useEffect, useState } from 'react'
import type ParchmentDocument from '@interfaces/document'
import { mutate } from 'swr'

export default function DocumentPreview ({ activeDocument, setActiveDocument }: { activeDocument: ParchmentDocument | null, setActiveDocument: Function }): JSX.Element {
  const [slideoverOpen, setSlideoverOpen] = useState(false)
  useEffect(() => {
    setSlideoverOpen(activeDocument !== null)
  }, [activeDocument])
  useEffect(() => {
    if (!slideoverOpen) {
      setTimeout(() => {
        setActiveDocument(null)
      }, 300) // Time it takes to close the slideover so the data doesn't null out
    }
  }, [slideoverOpen])

  return (
    <Slideover slideoverOpen={slideoverOpen} setSlideoverOpen={setSlideoverOpen}>
      {activeDocument &&
        <>
          <header className='px-4 sm:px-6'>
            <h2 className='text-lg leading-7 font-medium'>
              {activeDocument.title}
            </h2>
          </header>
          <div className='relative flex-1 px-4 sm:px-6'>
            <div className='absolute inset-0 px-4 sm:px-6 h-full'>
              <button className='rounded-lg bg-red-500 text-gray-50 p-2 px-4' onClick={() => { fetch(`/api/document/delete?id=${activeDocument._id}`).then(r => r.status === 200 && mutate('/api/home') && setSlideoverOpen(false)).catch(console.error) }}>Delete Document</button>
            </div>
          </div>
        </>
      }
    </Slideover>
  )
}
