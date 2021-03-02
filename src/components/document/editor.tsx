import ParchmentDocument, { compareDocuments } from '@interfaces/document'
import { useUnload } from '@shared/hooks'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import type { Node } from 'slate'
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

export default function DocumentEditor ({ activeDocument, mode }: { activeDocument: ParchmentDocument, mode: EditorModes }): JSX.Element {
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
  const [value, setValue] = useState<Node[]>(activeDocument.body)
  const [lastUpdate, setLastUpdate] = useState(new Date(activeDocument.lastModified).getTime())
  const router = useRouter()

  async function saveDocument (mutateDocument = false): Promise<void> {
    const docTitle = document.getElementById('doctitle') as HTMLInputElement | null
    const updatedDocument = {
      ...activeDocument,
      title: docTitle?.value || 'Untitled Document', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      body: value
    }
    if (compareDocuments(activeDocument, updatedDocument)) return
    const res = await fetch('/api/document/update', {
      method: 'POST',
      body: JSON.stringify({
        id: activeDocument._id,
        document: {
          title: updatedDocument.title,
          body: updatedDocument.body
        }
      })
    })

    if (!res.ok) {
      const data = await res.json()
        throw new Error(data.error)
      }
    if (mutateDocument) mutate(`/api/document/get?id=${activeDocument._id}`, updatedDocument).catch(console.error)
    setLastUpdate(Date.now())
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
      value={value}
      onChange={value => {
        setValue(value)

        if (mode !== EditorModes.Editing) return
        if ((Date.now() - lastUpdate) > 5000) { // If database was last updated more than 5 seconds ago
          saveDocument().catch(console.error)
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        placeholder='Write your heart out...'
        spellCheck
        autoFocus
        className='prose dark:prose-light min-h-screen'
        readOnly={mode !== EditorModes.Editing}
      />
      <DocumentStatusBar lastUpdate={lastUpdate} />
    </Slate>
  )
}

export function EditorWrapper ({ mode }: { mode: EditorModes }): JSX.Element {
  const router = useRouter()
  const { data: pageData } = useSWR(`/api/document/get?id=${router.query.document as string}`)
  const activeDocument: ParchmentDocument = pageData?.document

  return (
    <div className='p-32 pt-16 px-6 sm:px-32 md:px-64 lg:px-72 xl:px-96'>
      {activeDocument &&
        <DocumentEditor activeDocument={activeDocument} mode={mode} />
      }
      {!activeDocument &&
        <DocumentSkeleton />
      }
    </div>
  )
}
