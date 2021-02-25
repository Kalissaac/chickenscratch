import { useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import Editor from '@components/document/editor'
import Head from 'next/head'
import useSWR from 'swr'
import { useUser } from '@shared/hooks'
import { useRouter } from 'next/router'
import InitialLoader from '@components/loader'
import { DocumentSkeleton } from '@components/skeleton'
import type ParchmentDocument from '@interfaces/document'
import NotFoundPage from 'pages/404'

export default function DocumentEditPage (): JSX.Element {
  const router = useRouter()
  const { user, error: userError } = useUser()
  const { data: pageData, error: dataError } = useSWR(user ? `/api/document/get?id=${router.query.document as string}` : null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeDocument: ParchmentDocument = pageData?.document

  if (userError) {
    if (userError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
    if (userError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    throw userError
  }
  if (dataError) {
    if (dataError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
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
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeDocument={activeDocument} />
      <Titlebar setSidebarOpen={setSidebarOpen} activeDocument={activeDocument} />
      <div className='p-32 pt-16 px-6 sm:px-32 md:px-64 lg:px-72 xl:px-96'>
        {activeDocument &&
          <Editor activeDocument={activeDocument} mode={0} />
        }
        {!activeDocument &&
          <DocumentSkeleton />
        }
      </div>
    </>
  )
}
