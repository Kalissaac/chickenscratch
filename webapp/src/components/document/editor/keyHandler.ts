import type { KeyboardEvent } from 'react'
import { Editor, Element, type Node, type NodeEntry, Transforms } from 'slate'
import type { ReactEditor } from 'slate-react'

const keyEventHandler = (event: KeyboardEvent<HTMLDivElement>, editor: ReactEditor): void => {
  const codeBlock = matchBlock('code-block', editor)

  if (codeBlock) {
    codeBlockHandler(event, editor)
  }
}

const matchBlock = (type: string, editor: ReactEditor): NodeEntry<Node> => {
  const [block] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === type
  })

  return block
}

const codeBlockHandler = (event: KeyboardEvent<HTMLDivElement>, editor: ReactEditor): void => {
  if (event.key === 'Enter' && event.shiftKey) {
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
  } else if (event.key === 'Enter') {
    event.preventDefault()
    Transforms.insertText(editor, '\n')
  } else if (event.key === 'Tab') {
    event.preventDefault()
    Transforms.insertText(editor, '  ')
  }
}

export default keyEventHandler
