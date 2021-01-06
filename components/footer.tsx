import Link from 'next/link'

export default function Footer () {
  return (
    <div className="w-full h-72 bg-white dark:bg-gray-900 flex justify-between p-12 dark:text-gray-50">
      <div className="">
        <Link href='/'><a className='uppercase font-serif font-bold text-4xl dark:text-gray-50 border-black dark:border-white border-b-2'>Parchment</a></Link>
        <div className="mt-6 dark:text-gray-50">Copyright Schwa Industries.<br />All rights reserved.</div>
      </div>
      <div className="">

        hi
      </div>
    </div>
  )
}