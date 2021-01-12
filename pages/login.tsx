import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import Head from 'next/head'
import { Magic } from 'magic-sdk'
import { WebAuthnExtension } from '@magic-ext/webauthn'
import Router from 'next/router'

export default function LoginPage (): JSX.Element {
  const [activity, setActivity] = useState(false)
  const [loginStep, setLoginStep] = useState({ stage: 'initial', email: '' })
  const [magic, setMagic] = useState<Magic>()

  useEffect(() => {
    magic === null &&
      setMagic(
        new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? '', {
          extensions: [new WebAuthnExtension()]
        })
      )
    magic?.preload() // eslint-disable-line @typescript-eslint/no-floating-promises
  }, [magic])

  function returnToLogin (): void {
    setLoginStep({ stage: 'initial', email: '' })
  }

  async function submitLogin (e: FormEvent): Promise<void> {
    e.preventDefault()
    setActivity(true)

    const data = new FormData(e.target as HTMLFormElement)
    const email = data.get('email') as string
    const withSecurityKey = data.get('securitykey') as string

    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      setActivity(false)
      // display error here
    }

    if (withSecurityKey === 'on') {
      try {
        setLoginStep({ stage: 'securitykey', email })
        const didToken = await magic?.webauthn.login({ username: email })
        await authenticateWithServer(didToken)
      } catch (error) {
        setActivity(false)
        console.log(error)
      }
    } else {
      try {
        setLoginStep({ stage: 'email', email })
        const didToken = await magic?.auth.loginWithMagicLink({
          email,
          showUI: false
        })
        await authenticateWithServer(didToken ?? '')
      } catch (error) {
        setActivity(false) // re-enable login button - user may have requested to edit their email
        console.log(error)
      }
    }
  }

  async function authenticateWithServer (didToken: string): Promise<void> {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken
      }
    })
    res.status === 200 && Router.push('/home')
  }

  return (
    <div style={{ backgroundColor: '#152532' }}>
      <Head>
        <title>Login to Parchment</title>
      </Head>

      {loginStep.stage === 'initial' &&
        <div className='z-10 relative h-screen w-screen md:w-1/2 lg:w-1/3 bg-gray-100 dark:bg-gray-900 shadow-xl p-8 lg:p-20 overflow-hidden flex flex-col justify-between'>

          <div>
            <button className='text-gray-600 font-light mb-2 flex items-center' style={{ visibility: 'hidden' }}><ion-icon name='chevron-back-outline' /> Return</button>
            <h1 className='font-serif font-bold text-4xl md:text-5xl uppercase dark:text-gray-100'>Parchment</h1>
            <div className='mt-4 font-thin text-xl dark:text-gray-200'>
              Welcome back!<br />
              Sign in to continue.
            </div>
          </div>

          <div>
            <form action='/api/auth/callback/credentials' method='post' onSubmit={submitLogin}>
              <input type='email' name='email' placeholder='Email' className='my-3 login-field login-input' required />
              <br />
              <div className='my-3 login-field flex justify-between'>Use a Security Key <input type='checkbox' name='securitykey' /></div>
              <button type='submit' className={`login-btn mt-4 ${activity ? 'cursor-wait hover:bg-accent-1-500 pointer-events-none' : ''}`}>
                {activity && <svg className='animate-spin h-5 w-5 text-white self-center -ml-1 mr-3 inline' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' /></svg>}
                Sign In
              </button>
            </form>
          </div>

          <div className='text-accent-2 dark:text-gray-400 text-sm font-light mt-2'>
            Don't have an account?<br />One will be created when you sign in.
          </div>

        </div>}

      {loginStep.stage === 'email' &&
        <div className='z-10 relative h-screen w-screen md:w-1/2 lg:w-1/3 bg-gray-100 dark:bg-gray-900 shadow-xl p-8 lg:p-20 overflow-hidden flex flex-col justify-between'>

          <div>
            <button className='text-gray-600 font-light mb-2 flex items-center' onClick={returnToLogin}><ion-icon name='chevron-back-outline' /> Return</button>
            <h1 className='font-serif font-bold text-4xl md:text-5xl uppercase dark:text-gray-100'>Signing in...</h1>
            <div className='mt-4 font-thin text-xl dark:text-gray-200'>
              Click the link sent to<br />
              <span className='font-mono font-normal text-lg'>{loginStep.email}</span>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center'>
            <Image src='/images/puff.svg' width={100} height={100} />
            <div className='mt-4 font-light text-gray-600'>Check your email!</div>
          </div>

          <div className='text-accent-2 dark:text-gray-400 text-sm font-light mt-2'>
            Wrong account?<button className='text-accent-1-700' onClick={returnToLogin}>Sign in with another email address </button>
          </div>

        </div>}

      {loginStep.stage === 'securitykey' &&
        <div className='z-10 relative h-screen w-screen md:w-1/2 lg:w-1/3 bg-gray-100 dark:bg-gray-900 shadow-xl p-8 lg:p-20 overflow-hidden flex flex-col justify-between'>

          <div>
            <button className='text-gray-600 font-light mb-2 flex items-center' onClick={returnToLogin}><ion-icon name='chevron-back-outline' /> Return</button>
            <h1 className='font-serif font-bold text-4xl md:text-5xl uppercase dark:text-gray-100'>Signing in...</h1>
            <div className='mt-4 font-thin text-xl dark:text-gray-200'>
              Plug in your security key to sign in with<br />
              <span className='font-mono font-normal text-lg'>{loginStep.email}</span>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center'>
            <Image src='/images/puff.svg' width={100} height={100} />
            <div className='mt-4 font-light text-gray-600'>Plug in your security key</div>
          </div>

          <div className='text-accent-2 dark:text-gray-400 text-sm font-light mt-2'>
            Wrong account?<button className='text-accent-1-700' onClick={returnToLogin}>Sign in with another email address </button>
          </div>

        </div>}
      <Image src='/images/loginbg.jpg' layout='fill' className='object-cover' />
    </div>
  )
}
