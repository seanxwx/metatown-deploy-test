import { FC, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Loader } from 'lucide-react'
import { generateHTML } from '@tiptap/core'
import useMessages from '@/hooks/useMessages'
import useSpace from '@/hooks/useSpace'
import extensions from '../../extensions'
import Message from './_components/Message'

dayjs.extend(relativeTime)

const Messages: FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: messages, isLoading } = useMessages(space?.id)

  const scrollPositionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollPositionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return (
      <div className="p-6">
        <Loader className="animate-spin" role="status" aria-label="Loading" />
      </div>
    )
  }

  if (!messages) {
    return null
  }

  return (
    <div
      className="w-full space-y-4 overflow-y-auto"
      role="region"
      aria-label="messages"
    >
      {messages.map(({ createdAt, id, content, senderId }) => (
        <Message
          key={id}
          senderId={senderId}
          time={dayjs(createdAt).fromNow()}
          content={generateHTML(content, extensions)}
        />
      ))}
      <div ref={scrollPositionRef} />
    </div>
  )
}

export default Messages
