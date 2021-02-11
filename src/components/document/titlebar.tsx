import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ChevronLeft, Info } from '@kalissaac/react-feather'

export default function DocumentTitlebar ({ setSidebarOpen }: { setSidebarOpen: Function }): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const input = document.getElementById('doctitle') as HTMLInputElement
    if (input !== null) {
      input.setAttribute('value', `Title (#${router.query.document as string})`)
      input.size = Math.max(input?.value.length, 10)
    }
  }, [router.query])

  return (
    <div className='p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 opacity-80' style={{ backdropFilter: 'blur(24px)' }}>
      <button className='self-stretch flex justify-center items-center' onClick={() => router.back()}><ChevronLeft /></button>
      <input id='doctitle' type='text' className='text-center font-serif outline-none bg-transparent focus:outline-none focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 transition-all' placeholder='Untitled Document' onChange={(e) => { e.currentTarget.size = Math.max(e.currentTarget.value.length, 10) }} />
      <button className='self-stretch flex justify-center items-center' onClick={() => setSidebarOpen(true)}><Info /></button>
    </div>
  )
}
