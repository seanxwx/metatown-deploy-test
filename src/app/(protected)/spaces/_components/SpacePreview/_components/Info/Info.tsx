import { FC } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import IconButton from '@/components/IconButton'
import VerticalList from '@/components/VerticalList'
import Dropdown from '@/components/Dropdown'
import useSessionUser from '@/hooks/useSessionUser'
import useUserPresences from '@/hooks/useUserPresences'
import DeleteOrLeaveButton from './_components/DeleteOrLeaveButton'

dayjs.extend(relativeTime)

interface Props {
  name: string
  spaceId: string
}

const Info: FC<Props> = ({ name, spaceId }) => {
  const { data: user } = useSessionUser()
  const { data: userPresences } = useUserPresences(spaceId)

  const lastSeenAt = userPresences?.find(
    (userPresence) =>
      userPresence.userId === user?.id && userPresence.spaceId === spaceId
  )?.lastSeenAt

  return (
    <div className="flex items-center justify-between pt-1 text-white">
      <span className="text-sm">{name}</span>
      <div className="flex items-center gap-2">
        {lastSeenAt && (
          <span
            className="text-sm text-[#c6c6dd]"
            role="time"
            aria-label="Last seen at"
          >
            {dayjs(lastSeenAt).fromNow()}
          </span>
        )}
        <Dropdown
          trigger={(toggle, isOpen) => (
            <IconButton
              size="small"
              variant={isOpen ? 'secondary' : 'naked'}
              icon="more-vertical"
              label="Options"
              onClick={toggle}
              tooltip={{ position: 'top' }}
            />
          )}
          position="bottom-right"
          size="small"
          variant="dark"
        >
          <VerticalList>
            <VerticalList.Item>
              <DeleteOrLeaveButton spaceId={spaceId} />
            </VerticalList.Item>
          </VerticalList>
        </Dropdown>
      </div>
    </div>
  )
}

export default Info
