import { useState } from 'react'
import { Search as SearchIcon, FileText } from '@kalissaac/react-feather'
import Fuse from 'fuse.js'
import type ParchmentDocument from '@interfaces/document'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function SearchBar ({ files, style }: { files: ParchmentDocument[], style?: Object }): JSX.Element {
  const [results, setResults] = useState<Array<Fuse.FuseResult<ParchmentDocument>> | null>(null)

  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 basis h-full flex-grow focus-within:border-gray-400 relative ${results && results.length > 0 ? 'rounded-b-none' : ''}`} style={style}>
      <div className='flex items-center px-6' style={style}>
        <SearchIcon size='1.25em' aria-label='Search Icon' />
        <input
          type='text' placeholder='What are you looking for?' className='w-full ml-4 py-4 outline-none font-light dark:bg-gray-800 dark:text-gray-100 focus:outline-none'
          onChange={async (e) => {
            const { value } = e.currentTarget
            // Dynamically load fuse.js
            const fuse = new Fuse(files, {
              keys: ['title', 'body.children.text'],
              includeMatches: true
            })

            setResults(fuse.search(value))
          }}
          onBlur={() => {
            setResults(null)
          }}
        />
      </div>
      {results && results.length > 0 &&
        <ol className='absolute rounded-b-lg bg-white dark:bg-gray-800 text-gray-darker dark:text-gray-lighter border-2 border-t-0 border-gray-400 py-2 z-10 shadow-2xl top-full -left-0.5 -right-0.5'>
          {results.map(({ item: file, matches }) => (
            <li key={file._id}>
              <Link href={`/d/${file._id}/edit`}>
                <a className='w-full h-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 px-6 flex items-center'>
                  <FileText size='1.25em' aria-label='File Icon' />
                  <div className='ml-5'>
                    <div>{file.title}</div>
                    {/* Add in text matches here: <div>{JSON.stringify(matches)}</div> */}
                  </div>
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
