import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { FormEvent } from 'react'

export default function LoginPage() {
  const [activity, setActivity] = useState(false)
  function doSomething(e: FormEvent) {
    e.preventDefault()
    setActivity(true)

    fetch(e.currentTarget.getAttribute('action'), {
      method: 'POST',
      body: JSON.stringify({ message: 'hello!' })
    })
      .then(response => response.json())
      .then(data => {
        setActivity(false)
      })
  }
  return (
    <div style={{ backgroundColor: '#152532' }}>
      <div className='z-10 relative h-screen w-screen md:w-1/2 lg:w-1/3 bg-gray-100 dark:bg-gray-900 shadow-xl p-8 lg:p-24 overflow-hidden flex flex-col justify-between'>
        <div>
          <h1 className='font-serif font-bold text-4xl md:text-5xl uppercase dark:text-gray-100'>Parchment</h1>
          <div className='mt-4 font-thin text-xl dark:text-gray-200'>
            Welcome back!<br />
            Sign in to continue.
          </div>
        </div>

        <div>
          <form action='/api/v1/auth/login' method='post' onSubmit={doSomething}>
            <input type='email' name='email' id='email' placeholder='Email' className='my-3 login-input' required/>
            <br />
            <input type='password' name='password' id='password' placeholder='Password' className='my-3 login-input' required/>
            <br />
            <button type='submit' className={`login-btn mt-4 ${activity ? 'cursor-wait hover:bg-accent-1-500 pointer-events-none' : ''}`}>{activity && <svg className='animate-spin h-5 w-5 text-white self-center -ml-1 mr-3 inline' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path></svg>}Sign In</button>
          </form>
          <div className='my-2' />
          <Link href='/resetpassword'><a className='text-accent-2 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-light mt-2'>Forgot password</a></Link>
        </div>

        <div>
          <button className='text-accent-1-500 hover:text-accent-1-300'>Sign in with a Security Key</button>
          <br className='my-2' />
          <Link href='/register'><a className='text-accent-1-500 hover:text-accent-1-300'>Don’t have one? Create an Account</a></Link>
        </div>
      </div>
      <Image src='/images/loginbg.jpg' layout='fill' className='object-cover' />
    </div>
  )
}
