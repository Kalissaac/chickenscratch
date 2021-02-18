import type File from '@interfaces/file'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

dayjs.extend(relativeTime)

export default function Card ({ file }: { file: File }): JSX.Element {
  return (
    <Link href={`/d/${file._id}/edit`}>
      <a className='rounded-xl shadow-lg flex-1 min-w-0 mx-2 bg-white dark:bg-gray-900 box-border overflow-hidden cursor-pointer transform-gpu transition-transform duration-200 hover:scale-105 focus:scale-105 border-2 border-transparent focus:border-gray-darker dark:focus:border-gray-lighter focus:outline-none'>
        <div className='p-4 text-gray-50 bg-gradient-to-r from-yellow-600 to-red-500'>
          <div className='font-extralight text-xs'>{dayjs().to(dayjs(file.lastModified))} &#8226; {file.body.split(' ').length} {file.body.split(' ').length === 1 ? 'word' : 'words'} {file.due && `&#8226; due ${dayjs().to(dayjs(file.due))}`}</div>
          <h2 className='text-lg whitespace-nowrap overflow-ellipsis overflow-hidden'>{file.title}</h2>
        </div>
        <div className='p-4 text-sm whitespace-pre-wrap break-words overflow-hidden overflow-ellipsis' style={{ minHeight: '6rem', maxHeight: '10rem' }}>
          {file.body}
        </div>
      </a>
    </Link>
  )
}
