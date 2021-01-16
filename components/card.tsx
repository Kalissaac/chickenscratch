import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export default function Card ({ children }: { children?: ReactNode }): JSX.Element {
  const router = useRouter()
  return (
    <div className='rounded-lg shadow-lg w-1/5 bg-white dark:bg-gray-900 dark:text-gray-50 p-4 box-border cursor-pointer' onClick={async () => await router.push('/d/123134/edit')}>
      <div className='header p-4'>
        <div className='font-light'>subtitle</div>
        <h2>Title</h2>
      </div>
      <div className='content p-4'>
        {children}
      </div>
    </div>
  )
}
