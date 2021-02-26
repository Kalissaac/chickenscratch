import { useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import { EditorWrapper } from '@components/document/editor'
import Head from 'next/head'
import useSWR from 'swr'
import { useUser } from '@shared/hooks'
import { useRouter } from 'next/router'
import InitialLoader from '@components/loader'
import type ParchmentDocument from '@interfaces/document'
import NotFoundPage from 'pages/404'

export default function DocumentViewPage (): JSX.Element {
  const router = useRouter()
  const { error: userError } = useUser(false)
  const { data: pageData, error: dataError } = useSWR(`/api/document/get?id=${router.query.document as string}`)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeDocument: ParchmentDocument = pageData?.document

  if (userError) {
    if (userError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    if (userError.name !== 'USER_NOT_AUTHENTICATED') throw userError
  }
  if (dataError) {
    if (dataError.name === 'USER_NOT_AUTHENTICATED') return <NotFoundPage />
    if (dataError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    if (dataError.name === 'FILE_NOT_FOUND') return <NotFoundPage />
    throw dataError
  }

  return (
    <>
      <Head>
        {activeDocument &&
         <title>{activeDocument.title} | Parchment</title>
        }
      </Head>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Titlebar setSidebarOpen={setSidebarOpen} />
      <EditorWrapper mode={1} />
    </>
  )
}
