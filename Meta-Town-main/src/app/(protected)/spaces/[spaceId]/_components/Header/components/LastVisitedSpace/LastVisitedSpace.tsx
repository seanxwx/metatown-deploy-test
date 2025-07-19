import { FC } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Participants from '@/components/Participants'
import useUserPresences from '@/hooks/useUserPresences'
import useSessionUser from '@/hooks/useSessionUser'

dayjs.extend(relativeTime)

interface Props {
  name: string
  spaceId: string
}

const LastVisitedSpace: FC<Props> = ({ name, spaceId }) => {
  const { data: user } = useSessionUser()
  const { data: userPresences } = useUserPresences(spaceId)

  const lastSeenAt = userPresences?.find(
    (userPresence) =>
      userPresence.userId === user?.id && userPresence.spaceId === spaceId
  )?.lastSeenAt

  return (
    <div className="space-y-1">
      <div>{name}</div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {dayjs(lastSeenAt).fromNow()}
        </div>
        <Participants spaceId={spaceId} />
      </div>
    </div>
  )
}

export default LastVisitedSpace
