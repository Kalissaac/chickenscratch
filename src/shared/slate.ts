import type { BaseElement, BaseRange, BaseText } from 'slate'
import type { ReactEditor } from 'slate-react'

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder?: string
      type?: string
    }
    Range: BaseRange & {
      placeholder?: string
    }
    Element: BaseElement & {
      type?: string
      url?: string
    }
  }
}
