import { useEffect, useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import { EditorWrapper } from '@components/document/editor'
import Head from 'next/head'
import useSWR from 'swr'
import { useUser } from '@shared/hooks'
import { useRouter } from 'next/router'
import InitialLoader from '@components/loader'
import NotFoundPage from 'pages/404'
import ParchmentEditorContext, { createDocumentValue } from '@components/document/editor/context'

export default function DocumentEditPage (): JSX.Element {
  const router = useRouter()
  const { user, error: userError } = useUser()
  const { data: pageData, error: dataError } = useSWR(user ? `/api/document/get?id=${router.query.document as string}` : null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeDocument, documentAction] = createDocumentValue(pageData?.document)

  useEffect(() => {
    if (!activeDocument && pageData) documentAction({ type: 'dangerouslyOverwrite', payload: pageData.document })
  }, [pageData])

  if (userError) {
    if (userError.name === 'USER_NOT_AUTHENTICATED' || userError.name === 'USER_NOT_FOUND') return <InitialLoader />
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
      <ParchmentEditorContext.Provider value={[activeDocument, documentAction]}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Titlebar setSidebarOpen={setSidebarOpen} />
        <EditorWrapper mode={0} />
      </ParchmentEditorContext.Provider>
    </>
  )
}
