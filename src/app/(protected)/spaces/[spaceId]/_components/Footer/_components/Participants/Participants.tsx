import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import Button from '@/components/Button'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import useSpace from '@/hooks/useSpace'

export type Status = 'ONLINE' | 'OFFLINE'

interface Props {
  isSideWindowOpen?: boolean
  onClick: () => void
}

export const STATUS = {
  ONLINE: clsx('bg-green-500'),
  OFFLINE: clsx('bg-gray-500'),
} as const

const PARTICIPANT_STATUS = {
  ONLINE: 'Available',
  OFFLINE: 'Unavailable',
} as const

const Participants: FC<Props> = ({ isSideWindowOpen = false, onClick }) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: onlineUsers } = useOnlineUsers(space?.id)

  return (
    <Button
      variant={isSideWindowOpen ? 'secondary' : 'underline'}
      prefix={{ label: 'Users', icon: 'users' }}
      onClick={onClick}
      aria-label="Participants"
    >
      <span
        className={clsx(
          STATUS.ONLINE,
          'mx-2 inline-block h-3 w-3 rounded-full'
        )}
        aria-label={`Participant Status: ${PARTICIPANT_STATUS.ONLINE}`}
      />
      <span>{onlineUsers?.length ?? 0}</span>
    </Button>
  )
}

export default Participants
