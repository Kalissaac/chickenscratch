import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

export default function OnboardingPage (): JSX.Element {
  const [activity, setActivity] = useState(false)
  useEffect(() => {
    document.getElementById('name')?.focus()
  }, [])
  const { addToast } = useToasts()
  const router = useRouter()

  async function submitLogin (e: FormEvent): Promise<void> {
    e.preventDefault()
    setActivity(true)

    const data = new FormData(e.target as HTMLFormElement)
    const name = data.get('name') as string

    if (name.length < 1) {
      setActivity(false)
      addToast('Please enter a valid name!', { appearance: 'error' })
      return
    }

    try {
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name
        })
      })
      if (res.ok) {
        await router.push('/home')
        return
      }

      const data = await res.json()
      throw new Error(data.error)
    } catch (error) {
      setActivity(false)
      console.log({ error })
      addToast('Unknown error occured!', { appearance: 'error' })
    }
  }

  return (
    <div className='flex justify-evenly items-center h-screen'>
      <div>
        <p className='text-3xl font-light text-gray-800 tracking-wide mb-2'>Welcome to</p>
        <h1 className='font-serif uppercase text-5xl font-bold border-b-2 border-black'>Parchment</h1>
      </div>
      <div>
        <p className='font-light mb-4'>Let's get you started:</p>
        <form action='/api/auth/callback/credentials' method='post' onSubmit={submitLogin}>
          <label htmlFor='name' className='sr-only'>Name</label>
          <input className='login-field login-input' placeholder='Enter your name' id='name' name='name' />
          <button type='submit' className={`login-btn mt-4 ${activity ? 'cursor-wait hover:bg-accent-1-500 pointer-events-none' : ''}`}>
            {activity && <svg className='animate-spin h-5 w-5 text-white self-center -ml-1 mr-3 inline' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' /></svg>}
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
