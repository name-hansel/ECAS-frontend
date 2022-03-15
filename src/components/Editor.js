import React from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const Editor = () => {
  const [editor] = React.useState(() => withReact(createEditor()))
  const [value, setValue] = React.useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    >
      <Editable />
    </Slate>
  )
}

export default Editor