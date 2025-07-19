import { FC } from 'react'
import clsx from 'clsx'
import useUser from '@/hooks/useUser'
import Avatar from '@/components/Avatar'

export const STATUS = {
  ONLINE: clsx('bg-green-500'),
  OFFLINE: clsx('bg-gray-500'),
} as const

export type UserStatus = 'ONLINE' | 'OFFLINE'

interface Props {
  userId: string
  status: UserStatus
}

const Participant: FC<Props> = ({ userId, status }) => {
  const { data: user } = useUser(userId)

  if (!user) {
    return
  }

  return (
    <div
      role="presentation"
      className={clsx('flex space-x-5 rounded-xl', {
        'opacity-50': status === 'OFFLINE',
      })}
    >
      <Avatar character={user.avatar} name={user.displayName} />
      <div
        className="flex flex-1 items-center space-x-4"
        role="group"
        aria-label="User presence"
      >
        <span className="flex-1">{user.displayName}</span>
        <span
          className={clsx(STATUS[status], 'mx-2 h-3 w-3 rounded-full')}
          role="status"
          aria-label={`${user.displayName}'s Status: ${status}`}
        />
      </div>
    </div>
  )
}

export default Participant
