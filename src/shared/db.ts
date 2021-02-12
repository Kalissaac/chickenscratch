import Router from 'next/router'

export async function createDocument (): Promise<void> {
  const response = await fetch('/api/document/create')
  const data = await response.json()
  await Router.push(`/d/${data.id as string}/edit`)
}

export async function getDocument (): Promise<void> {
  const response = await fetch('/api/document/create')
  const data = await response.json()
  await Router.push(`/d/${data.id as string}/edit`)
}
