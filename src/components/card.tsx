import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { ReactNode } from 'react'

dayjs.extend(relativeTime)

export default function Card ({ title, subtitle = '', background, children, href }: { title: ReactNode, subtitle?: ReactNode, background?: string, children: ReactNode, href?: string }): JSX.Element {
  const parentClasses = 'rounded-xl shadow-lg hover:shadow-xl focus:shadow-xl flex-1 min-w-0 mx-2 bg-white dark:bg-gray-900 box-border overflow-hidden duration-200 hover:scale-105 focus:scale-105 bg-clip-border border-2 border-transparent focus:border-gray-darker dark:focus:border-gray-lighter focus:outline-none'
  const inner = (
    <>
      <div className={`p-4 text-gray-50 ${background ?? ''}`}>
        <div className='font-extralight text-xs mb-1'>{subtitle} </div>
        <h2 className='text-lg whitespace-nowrap overflow-ellipsis overflow-hidden'>{title} </h2>
      </div>
      <div className='p-4 text-sm whitespace-pre-wrap break-words overflow-hidden overflow-ellipsis' style={{ minHeight: '6rem', maxHeight: '10rem' }}>
        {children}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href}>
        <a className={parentClasses + ' transform-gpu transition-transform'}>
          {inner}
        </a>
      </Link>
    )
  } else {
    return (
      <div className={parentClasses}>
        {inner}
      </div>
    )
  }
}
