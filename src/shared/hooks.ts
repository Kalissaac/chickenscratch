import { useEffect, useRef } from 'react'
import Router, { NextRouter } from 'next/router'
import useSWR from 'swr'
import type User from '@interfaces/user'

export function useUser (redirectIfNotFound = true): { user: User, loading: boolean, error: Error } {
  const { data, error } = useSWR('/api/user')

  useEffect(() => {
    if (redirectIfNotFound && error?.name === 'USER_NOT_AUTHENTICATED') Router.push('/login').catch(console.error)
  }, [error])

  return {
    user: (data && data.user as User) || undefined,
    loading: !error && !data,
    error
  }
}

export const useUnload = (fn: Function, router: NextRouter): void => {
  const cb = useRef(fn) // init with fn, so that type checkers won't assume that current might be undefined

  useEffect(() => {
    cb.current = fn
  }, [fn])

  useEffect(() => {
    const onUnload = (): void => cb.current?.()

    router.events.on('routeChangeStart', onUnload)

    return () => {
      router.events.off('routeChangeStart', onUnload)
    }
  }, [])

  useEffect(() => {
    const onUnload = (...args: any[]): void => cb.current?.(...args)

    window.addEventListener('beforeunload', onUnload)

    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])
}
