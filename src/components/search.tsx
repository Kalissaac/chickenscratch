import { useState } from 'react'
import { Search as SearchIcon, FileText } from '@kalissaac/react-feather'
import Fuse from 'fuse.js'
import type File from '@interfaces/file'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function SearchBar ({ files, style }: { files: File[], style?: Object }): JSX.Element {
  const [results, setResults] = useState<Array<Fuse.FuseResult<File>> | null>(null)

  return (
    <div className='bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 basis h-full flex-grow focus-within:border-gray-400 relative' style={style}>
      <div className='flex items-center px-6' style={style}>
        <SearchIcon size='1.25em' aria-label='Search Icon' />
        <input
          type='text' placeholder='What are you looking for?' className='w-full ml-4 py-4 outline-none font-light dark:bg-gray-800 dark:text-gray-100 focus:outline-none'
          onChange={async (e) => {
            const { value } = e.currentTarget
            // Dynamically load fuse.js
            const fuse = new Fuse(files, {
              keys: ['title', 'body']
            })

            setResults(fuse.search(value))
          }}
        />
      </div>
      {results && results.length > 0 &&
        <ol className='absolute rounded-b-md bg-white dark:bg-gray-900 text-gray-darker py-2 z-10 shadow-2xl -ring-offset-8 top-full left-0 right-0'>
          {results.map(({ item: file }) => (
            <li key={file._id}>
              <Link href={`/d/${file._id}/edit`}>
                <a className='w-full h-full bg-white hover:bg-gray-50 p-4 px-6 flex items-center'>
                  <FileText size='1.25em' aria-label='File Icon' />
                  <span className='ml-5'>{file.title}</span>
                  <span className='ml-auto text-gray-500'>{dayjs().to(dayjs(file.lastModified))}</span>
                </a>
              </Link>
            </li>
          ))}
        </ol>
      }
    </div>
  )
}
