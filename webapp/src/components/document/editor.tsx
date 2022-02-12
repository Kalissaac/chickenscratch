import ParchmentDocument, { compareDocuments } from '@interfaces/document'
import { useUnload } from '@shared/hooks'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState, useContext, Dispatch } from 'react'
import useSWR, { mutate } from 'swr'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { DocumentSkeleton } from '@components/skeleton'
import withShortcuts from '@components/document/editor/withShortcuts'
import Element from '@components/document/editor/element'
import Leaf from '@components/document/editor/leaf'
import withNoDoubleSpaces from '@components/document/editor/withNoDoubleSpaces'
import DocumentStatusBar from '@components/document/editor/statusbar'
import ParchmentEditorContext, { DocumentAction } from '@components/document/editor/context'
import withLinks from '@components/document/editor/withLinks'
import keyEventHandler from '@components/document/editor/keyHandler'

export enum EditorModes {
  Editing,
  Viewing,
  Commenting,
  Suggesting
}

export default function DocumentEditor ({ activeDocument, documentAction, mode }: { activeDocument: ParchmentDocument, documentAction: Dispatch<DocumentAction>, mode: EditorModes }): JSX.Element {
  const editor = useMemo(() =>
    withLinks(
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
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const router = useRouter()
  const { data: pageData } = useSWR(`/api/document/get?id=${router.query.document as string}`)
  const [lastUpdate, setLastUpdate] = useState(new Date(activeDocument.lastModified).getTime())
  const [updateLock, setUpdateLock] = useState(false)

  async function saveDocument (mutateDocument = false): Promise<void> {
    const finish = (): void => {
      setTimeout(() => {
        setUpdateLock(false)
      }, 1_000)
    }
    try {
      setUpdateLock(true)
      if (compareDocuments(pageData?.document, activeDocument)) return finish()
      const res = await fetch('/api/document/update', {
        method: 'POST',
        body: JSON.stringify({
          id: activeDocument._id,
          document: activeDocument
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      if (mutateDocument) mutate(`/api/document/get?id=${activeDocument._id}`, activeDocument).catch(console.error)
      setLastUpdate(Date.now())
    } catch (error) {
      setUpdateLock(false)
      throw error
    }
    finish()
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
        documentAction({
          type: 'setBody',
          payload: value
        })

        if (mode !== EditorModes.Editing) return
        if (!updateLock && (Date.now() - lastUpdate) > 5000) { // If database was last updated more than 5 seconds ago
          saveDocument().catch(console.error)
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            saveDocument().catch(console.error)
          } else {
            keyEventHandler(event, editor)
          }
        }}
        placeholder='Write your heart out...'
        spellCheck
        autoFocus
        className='prose prose-neutral dark:prose-invert prose-h1:text-3xl prose-a:text-accent-1-500 hover:prose-a:text-accent-1-300 dark:prose-a:text-accent-1-50 dark:hover:prose-a:text-accent-1-200 dark:prose-pre:bg-gray-800 min-w-full min-h-screen font-editor'
        readOnly={mode !== EditorModes.Editing}
        id='document_editor'
      />
      <DocumentStatusBar activeDocument={activeDocument} lastUpdate={lastUpdate} updateLock={updateLock} saveDocument={async () => await saveDocument()} />
    </Slate>
  )
}

export function EditorWrapper ({ mode, className = '' }: { mode: EditorModes, className?: string }): JSX.Element {
  const [activeDocument, documentAction] = useContext(ParchmentEditorContext)

  return (
    <div className={`mt-16 pb-32 mx-12 lg:mx-[25vw] ${className}`}>
      {(activeDocument && documentAction)
        ? <DocumentEditor activeDocument={activeDocument} documentAction={documentAction} mode={mode} />
        : <DocumentSkeleton />
      }
    </div>
  )
}
