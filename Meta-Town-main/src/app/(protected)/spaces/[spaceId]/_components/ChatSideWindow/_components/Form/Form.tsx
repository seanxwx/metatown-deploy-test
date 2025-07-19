'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { useParams } from 'next/navigation'
import { FC, FormEvent } from 'react'
import IconButton from '@/components/IconButton'
import createMessage from '@/db/createMessage'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import extensions from '../../extensions'
import CompactProse from '../CompactProse'
import RichTextToolbar from './_components/RichTextToolbar'

const Form: FC = () => {
  const { data: user } = useSessionUser()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        class:
          'max-h-96 w-full overflow-y-auto rounded-lg border border-neutral-400 bg-white p-3 text-neutral-900 focus:outline-none',
      },
    },
  })

  if (!user || !space || !editor) {
    return null
  }

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()

    if (editor.isEmpty) {
      return
    }

    await createMessage({
      senderId: user.id,
      spaceId: space.id,
      content: editor.getJSON(),
    })

    editor.commands.setContent('')
  }

  return (
    <form
      role="form"
      className="rounded-2xl border border-black p-4"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <RichTextToolbar editor={editor} />
      <div className="mt-4 flex justify-center gap-2">
        <div className="flex-1">
          <CompactProse>
            <EditorContent editor={editor} />
          </CompactProse>
        </div>
        <IconButton
          disabled={editor.isEmpty}
          type="submit"
          tooltip={{ position: 'top' }}
          icon="send"
          label="Send"
        />
      </div>
    </form>
  )
}

export default Form
