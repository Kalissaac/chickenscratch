import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ChevronLeft, Info } from 'react-feather'

export default function DocumentTitlebar ({ setSidebarOpen }: { setSidebarOpen: Function }): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    document.getElementById('doctitle')?.setAttribute('value', `Title (#${router.query.document as string})`)
  }, [router.query])

  return (
    <div className='p-6 flex justify-between items-center text-gray-800 text-2xl bg-white dark:bg-gray-900 opacity-80' style={{ backdropFilter: 'blur(24px)' }}>
      <button className='flex justify-center items-center' onClick={() => router.back()}><ChevronLeft /></button>
      <input id='doctitle' type='text' className='text-center font-serif outline-none bg-transparent focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all' placeholder='Untitled Document' />
      <button className='flex justify-center items-center' onClick={() => setSidebarOpen(true)}><Info /></button>
    </div>
  )
}