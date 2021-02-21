import { Home } from '@kalissaac/react-feather'
import Head from 'next/head'
import Link from 'next/link'

export default function NotFoundPage (): JSX.Element {
  return (
    <>
      <Head>
        <title>Not Found | Parchment</title>
      </Head>
      <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='font-bold font-serif text-4xl mb-4'>Oh snap!</h1>
        <h3 className='font-medium text-lg mb-8'>We couldn't find the page you requested.</h3>
        <Link href='/home'><a className='flex items-center rounded-lg bg-accent-1-500 p-4 py-3 shadow-xl hover:shadow-2xl transition-shadow text-gray-50'><Home className='mr-2' /> Go Home</a></Link>
      </div>
      <p className='uppercase font-serif font-bold text-lg border-black dark:border-white text-center -mt-12'>Parchment</p>
    </>
  )
}
