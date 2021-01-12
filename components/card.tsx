import { ReactNode } from 'react'

export default function Card ({ children }: { children?: ReactNode }): JSX.Element {
  return (
    <div className='rounded-lg shadow-lg bg-white dark:bg-gray-900 p-4 box-border'>
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
