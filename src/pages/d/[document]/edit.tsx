import { useRouter } from 'next/router'
import { useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import Editor from '@components/document/editor'

export default function DocumentEditPage (): JSX.Element {
  const router = useRouter()
  const documentID = router.query.document as string
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Titlebar setSidebarOpen={setSidebarOpen} />
      <div className='p-32 px-56 min-h-screen'>
        <Editor />
      </div>
    </>
  )
}
