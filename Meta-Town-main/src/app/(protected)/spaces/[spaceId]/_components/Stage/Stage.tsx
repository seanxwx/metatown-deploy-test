'use client'

import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { FC, useRef } from 'react'
import {
  Block,
  ConfigItem,
  Dimensions,
  Ground,
  Indexed,
  Position,
} from '@/app/types'
import IconButton from '@/components/IconButton'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUserMovements from '@/hooks/useUserMovements'
import Canvas from './_components/Canvas'
import Character from './_components/Character'
import EnteredZone from './_components/EnteredZone'
import useCameraOffset from './_hooks/useCameraOffset'
import useConfigPosition from './_hooks/useConfigPosition'
import useDrawMainCanvas from './_hooks/useDrawMainCanvas'
import useMovement from './_hooks/useMovement'
import useUpdateSpacePosition from './_hooks/useUpdateSpacePosition'
import useUpdateStageConfig from './_hooks/useUpdateStageConfig'
import useZoom from './_hooks/useZoom'

interface Data {
  blocks: Block[] | null
  entry: Position
  zones: Indexed<Position>[] | null
  grounds: Ground[] | null
}

interface Props {
  data: Data
  isConfiguring?: boolean
  dimensions: Dimensions
  userPosition: Indexed<Position & { userId: string; spaceId: string }>
  configItem?: ConfigItem | null
}

const Stage: FC<Props> = ({
  data,
  isConfiguring = false,
  dimensions,
  userPosition: initialUserPosition,
  configItem = null,
}) => {
  const { blocks, entry, zones, grounds } = data
  const { data: sessionUser } = useSessionUser()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: onlineUsers } = useOnlineUsers(space?.id)
  const { data: userMovements } = useUserMovements(space?.id)

  const otherUsers = onlineUsers?.filter((userId) => userId !== sessionUser?.id)

  const otherUserMovements = userMovements?.filter((movement) =>
    otherUsers?.includes(movement.userId)
  )

  const userMovement = useMovement(initialUserPosition, dimensions, [
    ...(blocks ?? []),
    ...(otherUserMovements ?? []),
  ])

  const { zoom, zoomIn, zoomOut } = useZoom()

  useUpdateSpacePosition(userMovement)

  const ref = useRef<HTMLCanvasElement>(null)

  const cameraOffset = useCameraOffset(ref, {
    zoom,
    dimensions,
    userPosition: userMovement,
  })

  const canvasConfig = {
    zoom,
    cameraOffset,
  }

  const configPosition = useConfigPosition(
    ref.current,
    configItem,
    dimensions,
    canvasConfig,
    { blocks, entry, grounds, zones }
  )

  useUpdateStageConfig(ref.current?.parentElement, {
    configPosition,
  })

  const walls = blocks

  useDrawMainCanvas(ref.current, canvasConfig, {
    isConfiguring,
    zones,
    dimensions,
    walls,
    entry,
    grounds,
    configPosition,
  })

  return (
    <div className="relative size-full">
      <Canvas
        aria-label="Main Canvas"
        className={clsx({ 'cursor-pointer': configItem })}
        ref={ref}
      />
      {!isConfiguring && (
        <>
          {otherUsers?.map((userId) => (
            <Character
              key={userId}
              userId={userId}
              movement={otherUserMovements?.find(
                (otherUserMovement) => otherUserMovement.userId === userId
              )}
              canvasConfig={canvasConfig}
            />
          ))}
          <EnteredZone
            movement={userMovement}
            zones={zones}
            dimensions={dimensions}
            canvasConfig={canvasConfig}
          />
        </>
      )}
      {sessionUser && (
        <Character
          userId={sessionUser.id}
          movement={userMovement}
          canvasConfig={canvasConfig}
        />
      )}
      <div className="absolute bottom-8 right-4 space-x-2 text-white">
        <IconButton
          icon="zoom-out"
          label="Zoom Out"
          tooltip={{ position: 'top' }}
          onClick={zoomOut}
          size="small"
        />
        <IconButton
          icon="zoom-in"
          label="Zoom In"
          tooltip={{ position: 'top' }}
          onClick={zoomIn}
          size="small"
        />
      </div>
    </div>
  )
}

export default Stage
