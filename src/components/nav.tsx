import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchBar from '@components/search'
import { Transition } from '@headlessui/react'
import { Edit2, MoreVertical, Plus, X as IconX } from '@kalissaac/react-feather'
import type { jwtUser } from '@shared/cookies'
import { Magic } from 'magic-sdk'
import { WebAuthnExtension } from '@magic-ext/webauthn'
import Image from 'next/image'
import { useRouter } from 'next/router'

const links = [
  { href: '/home#recent', label: 'Recently Edited' },
  { href: '/home#files', label: 'All Files' },
  { href: '/home#invitations', label: 'Invitations' },
  { href: '/about', label: 'About' }
]

export default function Nav ({ user }: { user: jwtUser }): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const intersection = new IntersectionObserver(([entry], observer) => {
      entry.isIntersecting ? setScrolling(false) : setScrolling(true)
    }, {
      threshold: [0.1, 1.0]
    })

    const homeSearch = document.getElementById('homesearch') as Element
    if (homeSearch !== null) {
      intersection.observe(homeSearch)
    }

    return () => {
      intersection.disconnect()
    }
  }, [])

  async function createDocument (): Promise<void> {
    const response = await fetch('/api/document/create')
    const data = await response.json()
    await router.push(`/d/${data.id as string}/edit`)
  }

  return (
    <>
      <nav className={`${scrolling ? 'bg-white dark:bg-gray-900 shadow-lg sticky' : ''} bg-opacity-90 flex items-center justify-between p-8 px-20 top-0 z-20 transition-all`} style={{ backdropFilter: 'blur(4px)' }}>
        <div className='flex items-center w-full'>
          <Link href='/home'><a className='uppercase font-serif font-bold text-4xl dark:text-white border-black dark:border-white border-r-2 pr-4 mr-12'>Parchment</a></Link>

          {!scrolling &&
            <ul className='flex gap-6 whitespace-nowrap'>
              {links.map(({ href, label }) => (
                <li key={label + href}><Link href={href}><a className='font-light hover:text-gray-500 dark:hover:text-gray-300 transition-all' style={{ scrollBehavior: 'smooth' }}>{label}</a></Link></li>
              ))}
            </ul>
          }

          {scrolling &&
            <>
              <SearchBar />
              <button className='bg-accent-1-500 shadow-lg flex justify-center items-center rounded-md text-gray-50 h-14 w-14 ml-4' onClick={createDocument}><Plus /></button>
            </>
          }
        </div>

        <div className='ml-8'>
          <button className='font-medium text-lg text-gray-800 dark:text-gray-50 hover:text-gray-500 dark:hover:text-gray-300 flex gap-1 items-center transition-all whitespace-nowrap' onClick={() => setSidebarOpen(!sidebarOpen)}>
            {user.email} <MoreVertical />
          </button>
        </div>

      </nav>
      <ProfileSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} user={user} />
    </>
  )
}

function ProfileSidebar ({ setSidebarOpen, sidebarOpen, user }: { setSidebarOpen: Function, sidebarOpen: boolean, user: jwtUser }): JSX.Element {
  // @ts-expect-error 2345 TypeScript doesn't like it when we initialize states with null
  // const [magic, setMagic] = useState<Magic>(null)

  // useEffect(() => {
  //   magic === null &&
  //     setMagic(
  //       new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? '', {
  //         extensions: [new WebAuthnExtension()]
  //       })
  //     )
  //   magic?.preload() // eslint-disable-line @typescript-eslint/no-floating-promises
  // }, [magic])

  return (
    <div className='fixed inset-0 z-30 overflow-hidden pointer-events-none'>
      <div className='absolute inset-0 overflow-hidden'>
        <Transition
          show={sidebarOpen}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          {(ref) => (
            <div ref={ref} className='absolute inset-0 bg-gray-800 bg-opacity-75 transition-opacity pointer-events-auto' style={{ backdropFilter: 'blur(0px)' }} onClick={() => setSidebarOpen(!sidebarOpen)} />
          )}
        </Transition>
        <section className='absolute inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto'>
          <Transition
            show={sidebarOpen}
            enter='transform transition ease-in-out duration-500 sm:duration-700'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leave='transform transition ease-in-out duration-500 sm:duration-700'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'
          >
            {(ref) => (
              <div ref={ref} className='relative w-screen max-w-md'>
                <Transition.Child
                  enter='opacity transition ease-in-out duration-500'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='opacity transition ease-in-out duration-500'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-0 left-0 -ml-8 pt-6 pr-2 flex sm:-ml-10 sm:pr-4'>
                    <button aria-label='Close panel' onClick={() => setSidebarOpen(!sidebarOpen)} className='text-gray-100 hover:text-gray-400 text-3xl transition ease-in-out duration-150'>
                      <IconX />
                    </button>
                  </div>
                </Transition.Child>
                <div className='h-full flex flex-col space-y-6 py-6 bg-white dark:bg-gray-900 shadow-xl overflow-y-scroll'>
                  <header className='px-4 sm:px-6'>
                    <h2 className='text-lg leading-7 font-medium'>
                      Profile
                    </h2>
                  </header>
                  <div className='relative flex-1 px-4 sm:px-6'>
                    <div className='absolute inset-0 px-4 sm:px-6 h-full'>
                      <div className='flex items-center'>
                        <div className='w-16 h-16 relative'>
                          <Image src='/images/user.jpg' layout='fill' objectFit='cover' className='rounded-full' />
                        </div>
                        <div className='ml-5 flex-grow'>
                          {/* <input id='username' type='text' className='font-semibold text-lg outline-none bg-transparent focus:border-gray-800 dark:focus:border-gray-50 border-transparent border-b-2 w-full transition-all' placeholder='Enter your name' /> */}
                          <div className='font-semibold text-lg'>Russ Hanneman <button><Edit2 width='0.9em' height='0.9em' /></button></div>
                          <div className='font-mono'>{user.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </section>
      </div>
    </div>
  )
}
