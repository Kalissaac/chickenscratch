import ParchmentDocument, { compareDocuments } from '@interfaces/document'
import { useUnload } from '@shared/hooks'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { DocumentSkeleton } from '@components/skeleton'
import withShortcuts from '@components/document/editor/withShortcuts'
import Element from '@components/document/editor/element'
import withNoDoubleSpaces from '@components/document/editor/withNoDoubleSpaces'
import DocumentStatusBar from '@components/document/editor/statusbar'

enum EditorModes {
  Editing,
  Viewing,
  Commenting,
  Suggesting
}

export default function DocumentEditor ({ cloudDocument, mode }: { cloudDocument: ParchmentDocument, mode: EditorModes }): JSX.Element {
  const editor = useMemo(() =>
    withNoDoubleSpaces(
      withShortcuts(
        withReact(
          withHistory(
            createEditor()
          )
        )
      )
    ),
  [])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const [activeDocument, setActiveDocument] = useState(cloudDocument)
  const [lastUpdate, setLastUpdate] = useState(new Date(activeDocument.lastModified).getTime())
  const [updateLock, setUpdateLock] = useState(false)
  const router = useRouter()

  async function saveDocument (mutateDocument = false): Promise<void> {
    setUpdateLock(true)
    const docTitle = document.getElementById('doctitle') as HTMLInputElement | null
    setActiveDocument((prevDocument) => {
      return {
        ...prevDocument,
        title: docTitle?.value || 'Untitled Document' // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      }
    })
    if (compareDocuments(cloudDocument, activeDocument)) return setUpdateLock(false)
    const res = await fetch('/api/document/update', {
      method: 'POST',
      body: JSON.stringify({
        id: activeDocument._id,
        document: {
          title: activeDocument.title,
          body: activeDocument.body
        }
      })
    })

    if (!res.ok) {
      const data = await res.json()
      setUpdateLock(false)
      throw new Error(data.error)
    }
    if (mutateDocument) mutate(`/api/document/get?id=${activeDocument._id}`, activeDocument).catch(console.error)
    setLastUpdate(Date.now())
    setUpdateLock(false)
  }

  useUnload(e => {
    if (mode !== EditorModes.Editing) return
    saveDocument(true).catch(err => {
      if (e) {
        e.preventDefault()
        e.returnValue = 'Document not saved!'
      }
      console.error(err)
    })
  }, router)

  return (
    <Slate
      editor={editor}
      value={activeDocument.body}
      onChange={value => {
        setActiveDocument((prevDocument) => {
          return {
            ...prevDocument,
            body: value
          }
        })

        if (mode !== EditorModes.Editing) return
        if (!updateLock && (Date.now() - lastUpdate) > 5000) { // If database was last updated more than 5 seconds ago
          saveDocument().catch(console.error)
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        placeholder='Write your heart out...'
        spellCheck
        autoFocus
        className='prose dark:prose-light min-w-full min-h-screen'
        readOnly={mode !== EditorModes.Editing}
      />
      <DocumentStatusBar activeDocument={activeDocument} lastUpdate={lastUpdate} updateLock={updateLock} />
    </Slate>
  )
}

export function EditorWrapper ({ mode }: { mode: EditorModes }): JSX.Element {
  const router = useRouter()
  const { data: pageData } = useSWR(`/api/document/get?id=${router.query.document as string}`)
  const cloudDocument: ParchmentDocument = pageData?.document

  return (
    <div className='m-32 mt-16 mx-6 sm:mx-32 md:mx-64 lg:mx-72 xl:mx-96'>
      {cloudDocument
        ? <DocumentEditor cloudDocument={cloudDocument} mode={mode} />
        : <DocumentSkeleton />
      }
    </div>
  )
}
