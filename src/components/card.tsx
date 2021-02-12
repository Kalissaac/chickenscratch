import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export default function Card ({ children }: { children?: ReactNode }): JSX.Element {
  const router = useRouter()
  return (
    <div className='rounded-xl shadow-lg flex-grow mx-2 bg-white dark:bg-gray-900 box-border overflow-hidden cursor-pointer transform-gpu transition-transform duration-200 hover:scale-105 focus:scale-105 border-2 border-transparent focus:border-gray-darker focus:outline-none'
      onClick={async () => await router.push(`/d/${Math.floor(Math.random() * 10000)}/edit`)} tabIndex={0}>
      <div className='header p-4 text-gray-50 bg-gradient-to-r from-yellow-600 to-red-500'>
        <div className='font-extralight text-xs'>last edited 2d ago &#8226; 354 words &#8226; due 23:59 Saturday</div>
        <h2 className='text-lg'>Why is Water Wet?</h2>
      </div>
      <div className='content p-4 text-sm'>
        {children}
      </div>
    </div>
  )
}
