import { ContentState, Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useState } from 'react'

export default function DocumentEditor ({ activeDocument }: { activeDocument: any }): JSX.Element {
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(activeDocument.body)))

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      placeholder='Write your heart out...'
    />
  )
}
