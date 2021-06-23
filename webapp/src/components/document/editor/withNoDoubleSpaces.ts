import {
  Editor,
  Range
} from 'slate'
import { ReactEditor } from 'slate-react'

const withNoDoubleSpaces = (editor: ReactEditor): ReactEditor => {
  const { insertText } = editor

  editor.insertText = text => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const before = Editor.before(editor, anchor, { unit: 'character' }) ?? anchor
      const rangeBefore = { anchor, focus: before }
      const beforeText = Editor.string(editor, rangeBefore)

      if (beforeText === ' ') return

      const after = Editor.after(editor, anchor, { unit: 'character' }) ?? anchor
      const rangeAfter = { anchor, focus: after }
      const afterText = Editor.string(editor, rangeAfter)

      if (afterText === ' ') return
    }

    insertText(text)
  }

  return editor
}

export default withNoDoubleSpaces
