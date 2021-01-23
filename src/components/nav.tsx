import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchBar from './search'
import { Transition } from '@headlessui/react'
import { MoreVertical, Plus } from 'react-feather'

const links = [
  { href: '/home#recent', label: 'Recently Edited' },
  { href: '/home#files', label: 'All Files' },
  { href: '/home#invitations', label: 'Invitations' },
  { href: '/about', label: 'About' }
]

export default function Nav ({ user }: { user: any }): JSX.Element {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleScroll (_: Event): void {
    if (window.scrollY <= 60) {
      setScrolling(false)
    } else if (window.scrollY > 60 && !scrolling) {
      setScrolling(true)
    }
  }

  return (
    <nav className={`${scrolling ? 'bg-white dark:bg-gray-900 shadow-lg sticky' : ''} bg-opacity-95 flex items-center justify-between p-6 px-20 top-0 z-20 transition-all`} style={{ backdropFilter: 'blur(24px)' }}>
      <div className='flex items-center w-full'>
        <Link href='/home'><a className='uppercase font-serif font-bold text-4xl dark:text-white border-black dark:border-white border-r-2 pr-4 mr-12'>Parchment</a></Link>

        {!scrolling &&
          <ul className='flex gap-6 whitespace-nowrap'>
            {links.map(({ href, label }) => (
              <li key={label + href}><Link href={href}><a className='font-light hover:text-gray-500 dark:hover:text-gray-300 transition-all' style={{ scrollBehavior: 'smooth' }}>{label}</a></Link></li>
            ))}
          </ul>
        }

        <SearchBar style={{ visibility: scrolling ? 'visible' : 'hidden' }} />
        <button className='bg-accent-1-500 flex justify-center items-center rounded-md text-gray-50 h-14 w-14 ml-4' style={{ visibility: scrolling ? 'visible' : 'hidden' }}><Plus /></button>
      </div>

      <div className='ml-8'>
        <button className='font-medium text-lg text-gray-800 dark:text-gray-50 hover:text-gray-500 dark:hover:text-gray-300 flex gap-1 items-center transition-all whitespace-nowrap' onClick={() => setDropdownOpen(!dropdownOpen)}>
          Kian Sutarwala <MoreVertical />
        </button>
        <Transition show={dropdownOpen}>
          <div className='absolute rounded-md shadow-xl bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-600 border-2 float-right w-36 py-2 mt-2 flex flex-col'>
            <DropdownItem title='Profile' />
            <DropdownItem title='Sign Out' />
          </div>
        </Transition>
      </div>

    </nav>
  )
}

function DropdownItem ({ title, onClick, className }: { title: string, onClick?: HTMLAnchorElement, className?: string}): JSX.Element {
  return (
    <a className={`px-4 py-1 cursor-pointer hover:bg-gray-200`}>{title}</a>
  )
}
