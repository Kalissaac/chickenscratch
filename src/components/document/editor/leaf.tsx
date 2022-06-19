import type { RenderLeafProps } from 'slate-react'

const Leaf = ({ attributes, children, leaf }: RenderLeafProps): JSX.Element => {
  switch (leaf.type) {
    default:
      return <span {...attributes}>{children}</span>
  }
}

export default Leaf
