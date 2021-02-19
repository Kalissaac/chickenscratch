import type ParchmentDocument from '@interfaces/document'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { Node } from 'slate'

dayjs.extend(relativeTime)

const serialize = (nodes: Node[]): any => {
  return nodes.map(n => Node.string(n)).join('\n')
}

export default function Card ({ file }: { file: ParchmentDocument }): JSX.Element {
  const serializedBody = typeof file.body === 'string' ? file.body : serialize(file.body)
  return (
    <Link href={`/d/${file._id}/edit`}>
      <a className='rounded-xl shadow-lg flex-1 min-w-0 mx-2 bg-white dark:bg-gray-900 box-border overflow-hidden cursor-pointer transform-gpu transition-transform duration-200 hover:scale-105 focus:scale-105 border-2 border-transparent focus:border-gray-darker dark:focus:border-gray-lighter focus:outline-none'>
        <div className='p-4 text-gray-50 bg-gradient-to-r from-yellow-600 to-red-500'>
          <div className='font-extralight text-xs'>{dayjs().to(dayjs(file.lastModified))} &#8226; {serializedBody.split(' ').length} {serializedBody.split(' ').length === 1 ? 'word' : 'words'} {file.due && `&#8226; due ${dayjs().to(dayjs(file.due))}`}</div>
          <h2 className='text-lg whitespace-nowrap overflow-ellipsis overflow-hidden'>{file.title}</h2>
        </div>
        <div className='p-4 text-sm whitespace-pre-wrap break-words overflow-hidden overflow-ellipsis' style={{ minHeight: '6rem', maxHeight: '10rem' }}>
          {serializedBody}
        </div>
      </a>
    </Link>
  )
}
