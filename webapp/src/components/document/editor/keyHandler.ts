import type { KeyboardEvent } from 'react'
import { Editor, Element, Transforms } from 'slate'
import type { ReactEditor } from 'slate-react'

const keyEventHandler = (event: KeyboardEvent<HTMLDivElement>, editor: ReactEditor): void => {
  const [codeBlock] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'code-block'
  })

  if (event.key === 'Enter' && event.shiftKey && codeBlock) {
    event.preventDefault()
    const newParagraphLocation = editor.selection ? Editor.after(editor, editor.selection.focus, { distance: 1, unit: 'block' }) : undefined
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }]
    }, { at: newParagraphLocation })
    if (newParagraphLocation) {
      Transforms.setSelection(editor, {
        anchor: Editor.after(editor, newParagraphLocation, { distance: 1, unit: 'block' }),
        focus: Editor.after(editor, newParagraphLocation, { distance: 1, unit: 'block' })
      })
    }
  } else if (event.key === 'Enter' && codeBlock) {
    event.preventDefault()
    Transforms.insertText(editor, '\n')
  } else if (event.key === 'Tab' && codeBlock) {
    event.preventDefault()
    Transforms.insertText(editor, '  ')
  }
}

export default keyEventHandler
