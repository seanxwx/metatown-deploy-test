import { FC } from 'react'
import { useParams } from 'next/navigation'
import useSpace from '@/hooks/useSpace'
import useUserPresences from '@/hooks/useUserPresences'
import getUserPresences from '@/db/getUserPresences'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import SideWindow from '../SideWindow'
import Participant from './_components/Participant'

export type UserPresences = Awaited<ReturnType<typeof getUserPresences>>

interface Props {
  onClose: () => void
}

type Status = 'ONLINE' | 'OFFLINE'

export const sortUserPresences = (
  a: { id: string; status: Status },
  b: { id: string; status: Status }
): number => {
  if (a.status === 'ONLINE' && b.status !== 'ONLINE') {
    return -1
  }
  if (a.status !== 'ONLINE' && b.status === 'ONLINE') {
    return 1
  }

  return a.id.localeCompare(b.id)
}

const ParticipantsSideWindow: FC<Props> = ({ onClose }) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)

  const { data: userPresences } = useUserPresences(space?.id)
  const { data: onlineUsers } = useOnlineUsers(space?.id)

  const participants = userPresences
    ?.map((userPresence) => ({
      ...userPresence,
      status: onlineUsers?.includes(userPresence.userId)
        ? ('ONLINE' as const)
        : ('OFFLINE' as const),
    }))
    .sort(sortUserPresences)

  return (
    <SideWindow
      label="Participants Side Window"
      header="Participants"
      onClose={onClose}
    >
      <ul className="space-y-4">
        {participants?.map((userPresence) => (
          <li key={userPresence.id}>
            <Participant
              userId={userPresence.userId}
              status={userPresence.status}
            />
          </li>
        ))}
      </ul>
    </SideWindow>
  )
}

export default ParticipantsSideWindow
