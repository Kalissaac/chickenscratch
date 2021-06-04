import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchBar from '@components/search'
import { Edit2, Menu, MoreVertical, Plus } from '@kalissaac/react-feather'
import Image from 'next/image'
import Slideover from '@components/slideover'
import { useRouter } from 'next/router'
import type ParchmentDocument from '@interfaces/document'
import { useUser } from '@shared/hooks'
import { mutate } from 'swr'

const links = [
  { href: '/home#recent', label: 'Recently Edited' },
  { href: '/home#files', label: 'All Files' },
  { href: '/home#invitations', label: 'Invitations' },
  { href: '/about', label: 'About' }
]

export default function Nav ({ files }: { files: ParchmentDocument[] }): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    const intersection = new IntersectionObserver(([entry], observer) => {
      entry.isIntersecting ? setScrolling(false) : setScrolling(true)
    }, {
      threshold: [0.1, 1.0]
    })

    const homeSearch = document.getElementById('homesearch') as Element | null
    if (homeSearch) intersection.observe(homeSearch)

    return () => {
      intersection.disconnect()
    }
  }, [])

  return (
    <>
      <nav className={`${scrolling ? 'bg-gray-50 dark:bg-gray-900 shadow-lg sticky py-6' : 'p-8'} hidden lg:flex bg-opacity-95 dark:bg-opacity-95 items-center justify-between px-20 top-0 z-20 transition-colors backdrop-filter backdrop-blur`} aria-label='Navigation Bar'>
        <div className='flex items-center w-full'>
          <Link href='/home'><a className='uppercase font-serif font-bold text-4xl dark:text-white border-black dark:border-white border-r-2 pr-4 mr-12'>Parchment</a></Link>

          {!scrolling &&
            <ul className='flex space-x-6 whitespace-nowrap'>
              {links.map(({ href, label }) => (
                <li key={label + href}><Link href={href}><a className='font-light hover:text-gray-500 dark:hover:text-gray-300 transition-all'>{label}</a></Link></li>
              ))}
            </ul>
          }

          {scrolling &&
            <>
              <SearchBar files={files} />
              <button className='bg-accent-1-500 basis flex justify-center items-center text-gray-50 h-14 w-14 ml-4' onClick={async () => await router.push('/d/new')}><Plus aria-label='Add Icon' className='text-xl' /></button>
            </>
          }

          <span className='h-14' /> {/* To set navbar height so it's consistent in both states */}
        </div>

        <div className='ml-8'>
          <button className='font-medium text-lg text-gray-800 dark:text-gray-50 hover:text-gray-500 dark:hover:text-gray-300 flex items-center transition-all whitespace-nowrap' onClick={() => setSidebarOpen(!sidebarOpen)}>
            {user.name} <MoreVertical className='ml-1' aria-label='View More Icon' />
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <nav className='flex lg:hidden bg-white dark:bg-gray-900 shadow-lg sticky bg-opacity-95 dark:bg-opacity-95 items-center justify-between p-4 px-8 md:px-12 top-0 z-20 backdrop-filter backdrop-blur' aria-label='Navigation Bar'>
        <Link href='/home'><a className='h-full uppercase font-serif font-bold text-4xl dark:text-white border-accent-1-500 dark:border-white border-b-2 mr-12'>P</a></Link>
        <button className='h-full'><Menu size='1.5rem' /></button>
      </nav>
      <ProfileSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
    </>
  )
}

function ProfileSidebar ({ setSidebarOpen, sidebarOpen }: { setSidebarOpen: Function, sidebarOpen: boolean }): JSX.Element {
  const { user } = useUser()
  const router = useRouter()

  return (
    <Slideover setSlideoverOpen={setSidebarOpen} slideoverOpen={sidebarOpen}>
      <header className='flex items-center justify-between'>
        <h2 className='text-xl leading-7 font-semibold font-serif tracking-wide'>
          Profile
        </h2>
        <button className='text-red-500 hover:text-red-600' onClick={() => { router.push('/api/logout').then(() => { mutate('/api/user', null).catch(console.error) }).catch(() => { alert('Error logging out user') }) }}>Sign Out</button>
      </header>

      <div className='flex items-center'>
        <div className='w-16 h-16 relative'>
          <Image src='/images/user.jpg' alt='Profile picture' layout='fill' objectFit='cover' className='rounded-full' />
        </div>
        <div className='ml-5 flex-grow'>
          {/* <input id='username' type='text' className='font-semibold text-lg outline-none bg-transparent focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 w-full transition-all' placeholder='Enter your name' /> */}
          <div className='font-semibold text-lg'>{user.name} <button><Edit2 width='0.9em' height='0.9em' /></button></div>
          <div className='font-mono'>{user.email}</div>
        </div>
      </div>
    </Slideover>
  )
}
