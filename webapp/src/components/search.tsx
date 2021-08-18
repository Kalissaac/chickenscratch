import { ReactNode, useState } from 'react'
import { Search as SearchIcon, FileText } from '@kalissaac/react-feather'
import Fuse from 'fuse.js'
import type ParchmentDocument from '@interfaces/document'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Transition } from '@headlessui/react'

export default function SearchBar ({ files, style, size = 'md' }: { files: ParchmentDocument[], style?: Object, size?: 'sm' | 'md' }): JSX.Element {
  const [results, setResults] = useState<Array<Fuse.FuseResult<ParchmentDocument>> | null>(null)

  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 basis h-full flex-grow focus-within:border-gray-400 relative ${results && results.length > 0 ? 'rounded-b-none' : ''}`} style={style}>
      <div className='flex items-center px-6' style={style}>
        <SearchIcon size='1.25em' aria-label='Search Icon' />
        <input
          type='text' placeholder='What are you looking for?' title='Search documents' className={`w-full ml-4 ${size === 'sm' ? 'py-3' : 'py-4'} outline-none font-light dark:bg-gray-800 dark:text-gray-100 focus:outline-none`} aria-label='Search bar for documents'
          onChange={async (e) => {
            const { value } = e.currentTarget
            // Dynamically load fuse.js
            const fuse = new Fuse(files, {
              keys: ['title', 'body.children.text', 'body.children.children.text'],
              includeMatches: true
            })

            setResults(fuse.search(value))
          }}
          onBlur={() => {
            setResults(null)
          }}
        />
      </div>
      <Transition
        show={(results && results.length > 0) === true}
        as='ol'
        className='absolute z-10 top-full -left-0.5 -right-0.5 rounded-b-lg bg-white dark:bg-gray-800 text-gray-darker dark:text-gray-lighter border-2 border-t-0 border-gray-400 py-2 shadow-2xl'
        // enter='transition ease-in-out duration-200 transform'
        // enterFrom='-scale-y-full'
        // enterTo='scale-y-0'
        // leave='transition ease-in-out duration-300 transform'
        // leaveFrom='scale-y-0'
        // leaveTo='-scale-y-full'
      >
        {results?.map(({ item: file, matches }) => (
          <li key={file._id}>
            <Link href={`/d/${file._id}/edit`}>
              <a className='w-full h-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 px-6 flex items-center'>
                <FileText size='1.25em' aria-label='File Icon' />
                <div className='ml-5 flex-1 whitespace-nowrap overflow-ellipsis overflow-hidden'>
                  <div>{file.title}</div>
                  {matches &&
                    <div className='text-gray-600 dark:text-gray-400 text-sm'>{insertHighlights(matches[0])}</div>
                  }
                </div>
                <span className='self-endw ml-5 text-gray-500 dark:text-gray-400'>{dayjs().to(dayjs(file.lastModified))}</span>
              </a>
            </Link>
          </li>
        ))}
      </Transition>
    </div>
  )
}

function insertHighlights (match: Fuse.FuseResultMatch): ReactNode {
  let styledText = match.value ?? ''
  if (match.key !== 'body.children.text' && match.key !== 'body.children.children.text') return <></>
  for (const index of match.indices.slice().reverse()) {
    if (index[0] === index[1]) continue
    styledText = styledText.slice(0, index[1]) + '</mark>' + styledText.slice(index[1])
    styledText = styledText.slice(0, index[0]) + '<mark class="bg-accent-1-50">' + styledText.slice(index[0])
  }
  return (
    <span dangerouslySetInnerHTML={{ __html: styledText }}></span>
  )
}
