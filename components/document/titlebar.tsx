import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function DocumentTitlebar ({ setSidebarOpen }: { setSidebarOpen: Function }): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    document.getElementById('doctitle')?.setAttribute('value', `Title (#${router.query.document as string})`)
  }, [])

  return (
    <div className='p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 opacity-80' style={{ backdropFilter: 'blur(24px)' }}>
      <button className='flex justify-center items-center' onClick={() => router.back()}><ion-icon name='chevron-back-outline' /></button>
      <input id='doctitle' type='text' className='text-center font-serif outline-none bg-transparent focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all' placeholder='Untitled Document' />
      {/* <div className='font-serif'>Title (#{pid})</div> */}
      <button className='flex justify-center items-center' onClick={() => setSidebarOpen(true)}><ion-icon name='information-circle-outline' /></button>
    </div>
  )
}
