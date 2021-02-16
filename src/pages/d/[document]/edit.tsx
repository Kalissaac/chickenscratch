import { useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import Editor from '@components/document/editor'
import Head from 'next/head'
import useSWR from 'swr'
import { useUser } from '@shared/hooks'
import { useRouter } from 'next/router'
import InitialLoader from '@components/loader'

export default function DocumentEditPage (): JSX.Element {
  const router = useRouter()
  const { user, loading: userLoading, error: userError } = useUser()
  const { data: pageData, error: dataError } = useSWR(user ? `/api/document/get?id=${router.query.document as string}` : null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeDocument = pageData?.document

  if (userLoading) {
    // Show skeleton loader instead
    return <InitialLoader />
  }
  if (userError) {
    if (userError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
    if (userError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message={'Reconnecting...'} />
    throw userError
  }
  if (!activeDocument && !dataError) {
    // Show skeleton loader instead
    return <InitialLoader />
  }
  if (dataError) {
    if (dataError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
    if (dataError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message={'Reconnecting...'} />
    throw dataError
  }

  return (
    <>
      <Head>
        <title>{activeDocument.title || 'Untitled Document'} | Parchment</title>
      </Head>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeDocument={activeDocument} />
      <Titlebar setSidebarOpen={setSidebarOpen} activeDocument={activeDocument} />
      <div className='p-32 px-56'>
        <Editor activeDocument={activeDocument} />
      </div>
    </>
  )
}
