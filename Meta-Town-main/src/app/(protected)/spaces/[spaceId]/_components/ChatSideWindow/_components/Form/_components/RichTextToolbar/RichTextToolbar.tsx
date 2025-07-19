import { FC } from 'react'
import { Editor } from '@tiptap/react'
import IconButton from '@/components/IconButton'

interface Props {
  editor: Editor
}

export const FORMATTING_BUTTONS = [
  {
    type: 'bold',
    icon: 'bold',
    label: 'Bold',
    command: 'toggleBold',
  },
  {
    type: 'italic',
    icon: 'italic',
    label: 'Italic',
    command: 'toggleItalic',
  },
  {
    type: 'strike',
    icon: 'strikethrough',
    label: 'Strikethrough',
    command: 'toggleStrike',
  },
  {
    type: 'code',
    icon: 'code',
    label: 'Code',
    command: 'toggleCode',
  },
  {
    type: 'codeBlock',
    icon: 'file-code',
    label: 'Code block',
    command: 'toggleCodeBlock',
  },
  {
    type: 'orderedList',
    icon: 'list-ordered',
    label: 'Ordered list',
    command: 'toggleOrderedList',
  },
  {
    type: 'bulletList',
    icon: 'list',
    label: 'Bullet-point list',
    command: 'toggleBulletList',
  },
] as const

const RichTextToolbar: FC<Props> = ({ editor }) => (
  <div className="flex items-center">
    <IconButton
      tooltip={{ position: 'top' }}
      icon="at-sign"
      label="Mention someone"
      variant="naked"
      size="small"
    />
    <div className="mx-[4px] h-5 border-l-2 border-l-black" />
    {FORMATTING_BUTTONS.map(({ type, icon, label, command }) => (
      <IconButton
        key={type}
        onClick={() => editor.chain().focus()[command]().run()}
        tooltip={{ position: 'top' }}
        icon={icon}
        label={label}
        variant={editor.isActive(type) ? 'success' : 'naked'}
        size="small"
      />
    ))}
  </div>
)

export default RichTextToolbar
