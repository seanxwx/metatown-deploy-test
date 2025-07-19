import clsx from 'clsx'
import DOMPurify from 'dompurify'
import { FC } from 'react'
import Avatar from '@/components/Avatar'
import useSessionUser from '@/hooks/useSessionUser'
import useUser from '@/hooks/useUser'
import CompactProse from '../../../CompactProse'
import Meta from './_components/Meta'

interface Props {
  senderId: string
  time: string
  content: string
}

const Message: FC<Props> = ({ senderId, time, content }) => {
  const { data: user } = useSessionUser()
  const { data: sender } = useUser(senderId)

  if (!sender || !user) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="message"
      className={clsx('flex gap-4', {
        'flex-row-reverse': user.id === sender.id,
      })}
    >
      <div>
        <Avatar character={sender.avatar} name={sender.displayName} />
      </div>
      <div className="space-y-2">
        <Meta
          name={sender.displayName}
          time={time}
          isSender={user.id === sender.id}
        />
        <CompactProse>
          <div
            className={clsx(
              'w-fit rounded-xl border px-5 py-3',
              user.id === sender.id ? 'ml-auto bg-cyan-200' : 'bg-white'
            )}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </CompactProse>
      </div>
    </div>
  )
}

export default Message
