import type { RenderElementProps } from 'slate-react'

const Element = ({ attributes, children, element }: RenderElementProps): JSX.Element => {
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
    case 'link':
      return <a {...attributes} href={element.url} onDoubleClick={e => { window.open(element.url, '_blank') }}>{children}</a>
    case 'code-block':
      return <pre {...attributes}><code>{children}</code></pre>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default Element
