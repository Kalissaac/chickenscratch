import {
  Editor,
  Transforms,
  Range,
  Element as SlateElement
} from 'slate'
import { ReactEditor } from 'slate-react'

const withLinks = (editor: ReactEditor): ReactEditor => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  // Insert link when user pastes url
  editor.insertText = text => {
    if (text && isUrl(text) && !isCodeBlockActive(editor)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  // Insert link when user pastes url
  editor.insertData = data => {
    const text = data.getData('text/plain')

    if (text && isUrl(text) && !isCodeBlockActive(editor)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const isLinkActive = (editor: ReactEditor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  })
  return !!link
}

const isCodeBlockActive = (editor: ReactEditor): boolean => {
  const [codeblock] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'code-block'
  })
  return !!codeblock
}

const unwrapLink = (editor: ReactEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  })
}

const wrapLink = (editor: ReactEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: SlateElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : []
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const isUrl = (text: string): boolean => {
  return text.match(/^\s*((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)\s*$/gi) !== null
}

export default withLinks
