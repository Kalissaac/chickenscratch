import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchBar from './search'
import { Transition } from '@headlessui/react'

const links = [
  { href: '/home#recent', label: 'Recently Edited' },
  { href: '/home#files', label: 'All Files' },
  { href: '/home#invitations', label: 'Invitations' },
  { href: '/about', label: 'About' }
]

export default function Nav (): JSX.Element {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleScroll (event: any): void {
    if (window.scrollY <= 50) {
      setScrolling(false)
    } else if (window.scrollY > 50 && !scrolling) {
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
        <button className='bg-accent-1-500 flex justify-center items-center rounded-md text-white h-full w-16 self-stretch' style={{ visibility: scrolling ? 'visible' : 'hidden' }}><ion-icon name='add-outline' /></button>
      </div>

      <div className='ml-8'>
        <button className='font-medium text-lg text-gray-800 hover:text-gray-500 dark:text-gray-50 dark:hover:text-gray-300 flex gap-1 items-center transition-all whitespace-nowrap' onClick={() => setDropdownOpen(!dropdownOpen)}>
          Kian Sutarwala <ion-icon name={dropdownOpen ? 'chevron-up-outline' : 'chevron-down-outline'} />
        </button>
        <Transition show={dropdownOpen}>
          <div className='absolute rounded-lg bg-white right-16 w-36 p-2 mt-2 flex flex-col'>
            <div>Profile</div>
            <div>Sign Out</div>
          </div>
        </Transition>
      </div>

    </nav>
  )
}
