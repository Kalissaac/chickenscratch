import { Home } from '@kalissaac/react-feather'
import Link from 'next/link'
import type { NextPage } from 'next'

const ErrorPage: NextPage<{ statusCode: number | string }> = ({ statusCode }: { statusCode: number | string }) => {
  return (
    <>
      <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='font-bold font-serif text-4xl mb-4'>Oh snap!</h1>
        <h3 className='font-medium text-lg mb-1'>We encountered an internal server error. Please try again in a bit.</h3>
        <p className='text-gray-500 mb-8'><code>{statusCode} at {(new Date()).toISOString()}</code></p>
        <Link href='/home'><a className='flex items-center rounded-lg bg-accent-1-500 p-4 py-3 shadow-xl hover:shadow-2xl transition-shadow text-gray-50'><Home className='mr-2' /> Go Home</a></Link>
      </div>
      <p className='uppercase font-serif font-bold text-lg border-black dark:border-white text-center -mt-12'>Parchment</p>
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode ?? err?.name ?? 418
  return { statusCode }
}

export default ErrorPage
