import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export default function Card ({ children }: { children?: ReactNode }): JSX.Element {
  const router = useRouter()
  return (
    <div className='rounded-xl shadow-lg w-1/5 mx-2 bg-white dark:bg-gray-900 box-border overflow-hidden cursor-pointer transform-gpu transition-transform duration-200 hover:scale-105 border-2 focus:border-gray-darker'
      onClick={async () => await router.push(`/d/${Math.floor(Math.random() * 10000)}/edit`)} tabIndex={0}>
      <div className='header p-6 py-4 text-gray-50 bg-gradient-to-r from-yellow-600 to-red-500'>
        <div className='font-light'>subtitle</div>
        <h2>Title</h2>
      </div>
      <div className='content p-6 text-sm'>
        {children}
      </div>
    </div>
  )
}
