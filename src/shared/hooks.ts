import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { jwtUser } from './cookies'

const fetchUser = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null }
    })

export function useUser (redirectTo: string, redirectIfFound?: boolean): jwtUser | null {
  const { data, error } = useSWR('/api/user', fetchUser)
  const user = data?.user as jwtUser
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(() => {
    if (redirectTo === '' || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo).catch(console.error)
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])
  return error as Error ? null : user
}
