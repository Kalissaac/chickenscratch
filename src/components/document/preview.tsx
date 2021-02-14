import Slideover from '@components/slideover'
import { useEffect, useState } from 'react'

export default function DocumentPreview ({ activeDocument, setActiveDocument }: { activeDocument: string | null, setActiveDocument: Function }): JSX.Element {
  const [slideoverOpen, setSlideoverOpen] = useState(false)
  useEffect(() => {
    setSlideoverOpen(activeDocument !== null)
  }, [activeDocument])
  useEffect(() => {
    if (!slideoverOpen) setActiveDocument(null)
  }, [slideoverOpen])

  return (
    <Slideover slideoverOpen={slideoverOpen} setSlideoverOpen={setSlideoverOpen}>
      <header className='px-4 sm:px-6'>
        <h2 className='text-lg leading-7 font-medium'>
          Document Info
        </h2>
      </header>
      <div className='relative flex-1 px-4 sm:px-6'>
        <div className='absolute inset-0 px-4 sm:px-6'>
          <div className='h-full border-2 border-dashed border-gray-200'>{JSON.stringify(activeDocument)}</div>
        </div>
      </div>
    </Slideover>
  )
}
