import type File from '@interfaces/file'
import { useUnload } from '@shared/hooks'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { mutate } from 'swr'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import type { Node } from 'slate'
import { withHistory } from 'slate-history'

export default function DocumentEditor ({ activeDocument }: { activeDocument: File }): JSX.Element {
  const editor = useMemo(() => withReact(withHistory(createEditor())), [])
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
          title: docTitle?.value || activeDocument.title || 'Untitled Document', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
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
                title: docTitle?.value || activeDocument.title || 'Untitled Document', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
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
      <Editable placeholder='Write your heart out...' spellCheck autoFocus />
    </Slate>
  )
}
