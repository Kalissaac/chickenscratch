import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import Head from 'next/head'
import { Magic } from 'magic-sdk'
import { WebAuthnExtension } from '@magic-ext/webauthn'
import { useRouter } from 'next/router'
import { Switch, Transition } from '@headlessui/react'
import { useToasts } from 'react-toast-notifications'
import { Check, ChevronLeft, Loader, X } from '@kalissaac/react-feather'

export default function LoginPage (): JSX.Element {
  const [activity, setActivity] = useState(false)
  const [loginStep, setLoginStep] = useState({ stage: 'initial', email: '' })
  const emailRef = useRef<HTMLInputElement>(null)
  const [securityKeyEnabled, setSecurityKeyEnabled] = useState(false)
  const [magic, setMagic] = useState<Magic | null>(null)
  const { addToast } = useToasts()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.ok && router.push('/home'))
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    magic === null &&
      setMagic(
        new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? '', {
          extensions: [new WebAuthnExtension()]
        })
      )
    magic?.preload().catch(console.error)
  }, [magic])

  useEffect(() => {
    emailRef.current?.setAttribute('value', loginStep.email)
  }, [loginStep, emailRef.current])

  function returnToLogin (): void {
    setActivity(false)
    setLoginStep(currentState => ({ stage: 'initial', email: currentState.email }))
  }

  async function submitLogin (e: FormEvent): Promise<void> {
    e.preventDefault()
    setActivity(true)

    const data = new FormData(e.target as HTMLFormElement)
    const email = data.get('email') as string

    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      setActivity(false)
      addToast('Please enter a valid email!', { appearance: 'error' })
      return
    }

    if (securityKeyEnabled) {
      try {
        setLoginStep({ stage: 'securitykey', email })
        const webauthn = magic?.webauthn as WebAuthnExtension
        const didToken = await webauthn.login({ username: email })
        await authenticateWithServer(didToken ?? '')
      } catch (error) {
        returnToLogin()
        console.log({ error })
        switch (error.code) {
          case -32603:
            addToast('Email not found! Are you registered?', { appearance: 'error' })
            break
          default:
            addToast('Unknown error occured!', { appearance: 'error' })
        }
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
        returnToLogin()
        console.log({ error })
        switch (error.code) {
          default:
            addToast('Unknown error occured!', { appearance: 'error' })
        }
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
    if (res.ok) {
      router.push('/home').catch(console.error)
    } else {
      addToast('Unknown error occured!', { appearance: 'error' })
    }
  }

  function SecondaryStepWrapper ({ stage, secondary, prompt }: { stage: string, secondary: string, prompt: string }): JSX.Element {
    return (
      <Transition show={loginStep.stage === stage}>
        <div className='login-wrapper'>

          <div>
            <button className='text-gray-600 dark:text-gray-400 font-light mb-2 flex items-center' onClick={returnToLogin}><ChevronLeft /> Return</button>
            <h1 className='font-serif font-bold text-4xl md:text-5xl uppercase dark:text-gray-100'>Signing in...</h1>
            <div className='mt-4 font-thin text-xl dark:text-gray-200'>
              {secondary}<br />
              <span className='font-mono font-normal text-lg'>{loginStep.email}</span>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center'>
            <Image src='/images/puff.svg' width={100} height={100} className='lg:w-40' />
            <div className='mt-4 font-light text-gray-600 dark:text-gray-400'>{prompt}</div>
          </div>

          <div className='text-accent-2 dark:text-gray-400 text-sm font-light mt-2'>
            Wrong account?<br /><button className='text-accent-1-700 dark:text-accent-1-200' onClick={returnToLogin}>Sign in with another email address </button>
          </div>

        </div>
      </Transition>
    )
  }

  return (
    <div className='bg-[#152532]'>
      <Head>
        <title>Login to Parchment</title>
      </Head>

      <Transition show={loginStep.stage === 'initial'}>
        <div className='login-wrapper'>

          <div>
            <button className='text-gray-600 font-light mb-2 flex items-center' style={{ visibility: 'hidden' }}><ChevronLeft /> Return</button>
            <h1 className='font-serif font-bold text-4xl md:text-5xl uppercase dark:text-gray-100'>Parchment</h1>
            <div className='mt-4 font-thin text-xl dark:text-gray-200'>
              Welcome back!<br />
              Sign in to continue.
            </div>
          </div>

          <div>
            <form action='/api/auth/callback/credentials' method='post' onSubmit={submitLogin}>
              <input type='email' name='email' id='email' ref={emailRef} placeholder='Email' className='my-3 login-field login-input' required />
              <br />
              <div className='my-3 login-field flex justify-between relative'>
                <Switch.Group>
                  <Switch.Label>Use a Security Key</Switch.Label>
                  <Switch
                    checked={securityKeyEnabled}
                    onChange={setSecurityKeyEnabled}
                    className='bg-gray-300 dark:bg-gray-700 absolute right-4 top-3 bottom-3 flex rounded-md overflow-hidden w-16 self-stretch' type='button'
                  >
                    <span className={`w-1/2 ${!securityKeyEnabled ? 'bg-red-500 text-white' : 'bg-transparent'} transition-colors flex justify-center items-center self-stretch`}>
                      <X aria-label='X icon' />
                    </span>
                    <span className={`w-1/2 ${securityKeyEnabled ? 'bg-green-500 text-white' : 'bg-transparent'} transition-colors flex justify-center items-center self-stretch`}>
                      <Check aria-label='Checkmark icon' />
                    </span>
                  </Switch>
                </Switch.Group>
              </div>
              <button type='submit' aria-keyshortcuts='Enter' className={`login-btn mt-4 ${activity ? 'cursor-wait hover:bg-accent-1-500 pointer-events-none' : ''}`}>
                {activity && <Loader className='inline -ml-2 mr-2' style={{ animation: 'spin 2s linear infinite' }} />}
                Sign In
              </button>
            </form>
          </div>

          <div className='text-accent-2 dark:text-gray-400 text-sm font-light mt-2'>
            Don't have an account?<br />One will be created when you sign in.
          </div>

        </div>
      </Transition>

      <SecondaryStepWrapper stage='email' secondary='Click the link sent to' prompt='Check your email!' />

      <SecondaryStepWrapper stage='securitykey' secondary='Plug in your security key to sign in with' prompt='Plug in your security key' />

      <Image src='/images/loginbg.jpg' layout='fill' className='object-cover hidden md:visible' />
    </div>
  )
}
