import { ReactNode } from 'react'

export default function Card ({ children }: { children?: ReactNode }) {
  return (
    <div className='rounded-lg shadow-lg bg-gray-50 dark:bg-gray-900 p-4 h-24 w-24 box-border'>
      {children}
    </div>
  )
}