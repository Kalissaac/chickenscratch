import File from '@interfaces/file'
import { useUnload } from '@shared/hooks'
import { ContentState, Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutate } from 'swr'

export default function DocumentEditor ({ activeDocument }: { activeDocument: File }): JSX.Element {
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(activeDocument.body)))
  const router = useRouter()

  useUnload((e?: BeforeUnloadEvent) => {
    fetch('/api/document/update', {
      method: 'POST',
      body: JSON.stringify({
        id: activeDocument._id,
        updatedBody: editorState.getCurrentContent().getPlainText()
      })
    }).then(async r => {
      if (!r.ok) {
        const data = await r.json()
        throw new Error(data.error)
      }
      mutate(`/api/document/get?id=${activeDocument._id}`, { ...activeDocument, body: editorState.getCurrentContent().getPlainText() }).catch(err => {
        throw err
      })
    }).catch(err => {
      if (e) {
        e.preventDefault()
        e.returnValue = 'Document not saved!'
      }
      console.error(err)
    })
  }, router)

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      placeholder='Write your heart out...'
    />
  )
}
