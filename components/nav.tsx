import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/#edited', label: 'Recently Edited' },
  { href: '/#files', label: 'All Files' },
  { href: '/#invitations', label: 'Invitations' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  return (
    <nav className='bg-white dark:bg-gray-900 flex items-center justify-between p-8 px-16 shadow-lg sticky'>
      <div className='flex'>
        <Link href='/'><a className='uppercase font-serif font-bold text-4xl dark:text-white border-black dark:border-white border-r-2 pr-4'>Parchment</a></Link>
        <ul className='flex self-center ml-12 gap-6'>
          {links.map(({ href, label }) => (
            <li key={label + href}><Link href={href}><a className='font-light hover:text-gray-500 dark:text-gray-50 dark:hover:text-gray-300 transition-all'>{label}</a></Link></li>
          ))}
        </ul>
      </div>

      <button className='font-medium text-lg text-gray-800 hover:text-gray-500 dark:text-gray-50 dark:hover:text-gray-300 flex gap-1 items-center transition-all' onClick={() => setDropdownOpen(!dropdownOpen)}>
        Kian Sutarwala <ion-icon name={dropdownOpen ? 'chevron-up-outline' : 'chevron-down-outline'}></ion-icon>
      </button>
    </nav>
  )
}
