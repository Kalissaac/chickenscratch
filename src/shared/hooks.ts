import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import User from '@interfaces/user'

export function useUser (): { user: User, loading: boolean, error: Error } {
  const { data, error } = useSWR('/api/user')

  useEffect(() => {
    if (error) Router.push('/login').catch(console.error)
  }, [error])

  return {
    user: (data && data.user as User) || undefined,
    loading: !error && !data,
    error
  }
}
