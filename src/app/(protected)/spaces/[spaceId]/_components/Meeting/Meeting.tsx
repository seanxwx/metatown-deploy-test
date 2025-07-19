'use client'

import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { Indexed, Position } from '@/app/types'
import IconButton from '@/components/IconButton'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUserMovements from '@/hooks/useUserMovements'
import Layout from './_components/Layout'
import isNearby from './_utils/isNearby'

const NEARBY_MEETING_THRESHOLD = 5

interface Props {
  mediasoupClient?: MediasoupClient | null
  recorder?: {
    addTrack: (track: MediaStreamTrack) => void
    removeTrack: (track: MediaStreamTrack) => void
  } | null
  zones?: Indexed<Position>[] | null
}

const Meeting: FC<Props> = ({
  mediasoupClient = undefined,
  recorder = undefined,
  zones = [],
}) => {
  const [view, setView] = useState<'Map' | 'Meeting'>('Map')

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: onlineUsers } = useOnlineUsers(space?.id)
  const { data: userMovements } = useUserMovements(space?.id)
  const { data: user } = useSessionUser()

  const userMovement = userMovements?.find(({ userId }) => userId === user?.id)

  const enteredZone = zones?.find(
    (zone) =>
      userMovement && zone.x === userMovement.x && zone.y === userMovement.y
  )

  const nearbyUsers = onlineUsers?.filter((onlineUser) => {
    const nearbyUserMovement = userMovements?.find(
      ({ userId }) => userId === onlineUser
    )

    if (!userMovement || !nearbyUserMovement) {
      return false
    }

    const currentZone = zones?.find(
      (zone) =>
        zone.x === nearbyUserMovement.x && zone.y === nearbyUserMovement.y
    )

    if (currentZone || enteredZone) {
      return currentZone?.id === enteredZone?.id
    }

    return isNearby(
      { x: userMovement.x, y: userMovement.y },
      { x: nearbyUserMovement.x, y: nearbyUserMovement.y },
      NEARBY_MEETING_THRESHOLD
    )
  })

  if (!mediasoupClient || !nearbyUsers || nearbyUsers.length <= 1) {
    return null
  }

  return (
    <div className="absolute inset-0 flex flex-col gap-2 px-6 py-4">
      {view === 'Meeting' && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          role="presentation"
          aria-label="Overlay"
        />
      )}
      <div className="space-x-2 text-right">
        <IconButton
          label="Map view"
          icon="map"
          variant={view === 'Map' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setView('Map')}
        />
        <IconButton
          label="Meeting view"
          icon="grip"
          variant={view === 'Meeting' ? 'primary' : 'secondary'}
          size="small"
          tooltip={{ position: 'bottom-right' }}
          onClick={() => setView('Meeting')}
        />
      </div>
      <Layout
        view={view}
        mediasoupClient={mediasoupClient}
        recorder={recorder}
        users={nearbyUsers}
      />
    </div>
  )
}

export default Meeting
