import { useEffect, useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import { EditorModes, EditorWrapper } from '@components/document/editor'
import Head from 'next/head'
import useSWR from 'swr'
import { useUser } from '@shared/hooks'
import { useRouter } from 'next/router'
import InitialLoader from '@components/loader'
import NotFoundPage from 'pages/404'
import ParchmentEditorContext, { createDocumentValue } from '@components/document/editor/context'

export default function DocumentViewPage (): JSX.Element {
  const router = useRouter()
  const { error: userError } = useUser(false)
  const { data: pageData, error: dataError } = useSWR(`/api/document/get?id=${router.query.document as string}`)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeDocument, documentAction] = createDocumentValue(pageData?.document)

  useEffect(() => {
    if (!activeDocument && pageData) documentAction({ type: 'dangerouslyOverwrite', payload: pageData.document })
  }, [pageData])

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
      <ParchmentEditorContext.Provider value={[activeDocument, documentAction]}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mode={EditorModes.Viewing} />
        <Titlebar setSidebarOpen={setSidebarOpen} showBackButton={false} mode={EditorModes.Viewing} />
        <EditorWrapper mode={EditorModes.Viewing} />
      </ParchmentEditorContext.Provider>
    </>
  )
}
