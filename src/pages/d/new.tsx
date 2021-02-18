import { useRouter } from 'next/router'
import { DocumentSkeleton, SkeletonLine } from '@components/skeleton'
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
      <div className='p-6 flex justify-between items-center text-gray-800 dark:text-gray-50 text-2xl bg-white dark:bg-gray-900 opacity-80' style={{ backdropFilter: 'blur(24px)' }}>
        <button className='self-stretch flex justify-center items-center ml-4' onClick={() => router.back()}><ChevronLeft /></button>
        <SkeletonLine className='animate-pulse h-5 w-1/4 my-2' />
        <SkeletonLine className='animate-pulse h-5 w-5 self-center rounded-full mr-4' />
      </div>
      <div className='p-32 px-56'>
        <DocumentSkeleton />
      </div>
    </>
  )
}
