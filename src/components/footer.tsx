import Link from 'next/link'

// const companyNames = ['Refactored Sporks', 'Guacamole Gladiators', 'Solid Funiclars']

export default function Footer (): JSX.Element {
  return (
    <div className='w-full h-36 bg-gray-900 flex justify-center items-center p-12 text-gray-200 text-center'>
      <div>
        <Link href='/'><a className='uppercase font-newYorkMedium font-semibold text-2xl'>Parchment</a></Link>
        <div className='font-thin text-xs mt-2'>Copyright {new Date().getFullYear()} Refactored Sporks. All rights reserved.</div>
      </div>
    </div>
  )
}
