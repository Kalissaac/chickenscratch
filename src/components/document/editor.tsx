import type ParchmentDocument from '@interfaces/document'
import { useUnload } from '@shared/hooks'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { mutate } from 'swr'
import {
  Editor,
  Transforms,
  Range,
  Point,
  createEditor,
  Element as SlateElement
} from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import type { Node } from 'slate'
import { withHistory } from 'slate-history'

const SHORTCUTS = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'orderedlist-item',
  '1.': 'orderedlist-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six'
}

const withShortcuts = (editor: ReactEditor): ReactEditor => {
  const { deleteBackward, insertText } = editor

  editor.insertText = text => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)
        Transforms.delete(editor)
        const newProperties: Partial<SlateElement> = {
          type
        }
        Transforms.setNodes(editor, newProperties, {
          match: n => Editor.isBlock(editor, n)
        })

        if (type === 'list-item') {
          const list = { type: 'bulleted-list', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item'
          })
        } else if (type === 'orderedlist-item') {
          const list = { type: 'ordered-list', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'orderedlist-item'
          })
        }

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph'
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'bulleted-list',
              split: true
            })
          } else if (block.type === 'orderedlist-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'ordered-list',
              split: true
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}

const Element = ({ attributes, children, element }): JSX.Element => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'ordered-list':
      return <ol {...attributes}>{children}</ol>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'orderedlist-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default function DocumentEditor ({ activeDocument }: { activeDocument: ParchmentDocument }): JSX.Element {
  const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const [value, setValue] = useState<Node[]>(activeDocument.body)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const router = useRouter()

  useUnload((e?: BeforeUnloadEvent) => {
    const docTitle = document.getElementById('doctitle') as HTMLInputElement | null
    fetch('/api/document/update', {
      method: 'POST',
      body: JSON.stringify({
        id: activeDocument._id,
        document: {
          title: docTitle?.value || 'Untitled Document', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
          body: value
        }
      })
    }).then(async r => {
      if (!r.ok) {
        const data = await r.json()
        throw new Error(data.error)
      }
      mutate(`/api/document/get?id=${activeDocument._id}`, { ...activeDocument, body: value }).catch(err => {
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
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value)

        if ((Date.now() - lastUpdate) > 5000) { // If database was last updated more than 5 seconds ago
          const docTitle = document.getElementById('doctitle') as HTMLInputElement | null
          fetch('/api/document/update', {
            method: 'POST',
            body: JSON.stringify({
              id: activeDocument._id,
              document: {
                title: docTitle?.value || 'Untitled Document', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
                body: value
              }
            })
          }).then(async r => {
            if (!r.ok) {
              const data = await r.json()
              throw new Error(data.error)
            }
            setLastUpdate(Date.now())
          }).catch(err => {
            console.error(err)
          })
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        placeholder='Write your heart out...'
        spellCheck
        autoFocus
        className='prose min-h-screen dark:text-gray-50'
      />
    </Slate>
  )
}
