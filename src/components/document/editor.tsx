import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useState } from 'react'

export default function DocumentEditor (): JSX.Element {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      placeholder='Write your heart out...'
    />
  )
}
