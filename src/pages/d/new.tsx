import { useRouter } from 'next/router'
import { DocumentSkeleton } from '@components/skeleton'
import { ChevronLeft } from '@kalissaac/react-feather'

export default function DocumentEditPage (): JSX.Element {
  const router = useRouter()
  fetch('/api/document/create').then(async r => {
    const data = await r.json()
    if (r.ok) {
      await router.replace(`/d/${data.document._id as string}/edit`)
      return
    }

    if (data.error === 'USER_NOT_AUTHENTICATED') {
      await router.push('/login')
      return
    }
    throw new Error(data.error)
  }).catch(e => {
    throw e
  })

  return (
    <>
      <div className='p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 opacity-80 skeleton-loader' style={{ backdropFilter: 'blur(24px)' }}>
        <button className='self-stretch flex justify-center items-center' onClick={() => router.back()}><ChevronLeft /></button>
        <div className='animate-pulse h-5 my-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded' />
        <div className='self-center animate-pulse h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full' />
      </div>
      <div className='p-32 px-56'>
        <DocumentSkeleton />
      </div>
    </>
  )
}
