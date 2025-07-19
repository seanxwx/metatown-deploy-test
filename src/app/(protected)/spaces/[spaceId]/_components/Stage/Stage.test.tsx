import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import {
  Block,
  CameraOffset,
  ConfigItem,
  ConfigPosition,
  Dimensions,
  EmojiReaction,
  Ground,
  Indexed,
  Position,
} from '@/app/types'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUser from '@/hooks/useUser'
import useUserMovements from '@/hooks/useUserMovements'
import useDrawCharacterCanvas from './_components/Character/_hooks/useDrawCharacterCanvas'
import useConfigPosition from './_hooks/useConfigPosition'
import useDrawMainCanvas from './_hooks/useDrawMainCanvas'
import useUpdateSpacePosition from './_hooks/useUpdateSpacePosition'
import useUpdateStageConfig from './_hooks/useUpdateStageConfig'
import { BASE_ZOOM, ZOOM_STEP } from './_hooks/useZoom'
import useCameraOffset from './_hooks/useCameraOffset'
import Stage from './Stage'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useOnlineUsers')
const useOnlineUsersMock = vi.mocked(useOnlineUsers)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useUserMovements')
const useUserMovementsMock = vi.mocked(useUserMovements)

vi.mock('./_hooks/useDrawMainCanvas')

vi.mock('./_hooks/useConfigPosition')
const useConfigPositionMock = vi.mocked(useConfigPosition)

vi.mock('./_hooks/useUpdateStageConfig')

vi.mock('./_hooks/useUpdateSpacePosition')

vi.mock('./_hooks/useCameraOffset')
const useCameraOffsetMock = vi.mocked(useCameraOffset)

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('./_components/Character/_hooks/useDrawCharacterCanvas')

describe('Stage', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders canvas', () => {
    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useSessionUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOnlineUsers>
    )

    useUserMovementsMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserMovements>
    )

    useUserMock.mockReturnValue({} as unknown as ReturnType<typeof useUser>)

    const cameraOffset: CameraOffset = { left: 0, top: 0 }

    useCameraOffsetMock.mockReturnValue(
      cameraOffset as unknown as ReturnType<typeof useCameraOffset>
    )

    const emojiReaction: EmojiReaction = {
      emoji: {
        label: 'Thumbs Up',
        unicode: '👍',
      },
      userId: 'user123',
      createdAt: '2023-05-22T15:30:00Z',
    }

    useEmojiReactionMock.mockReturnValue({
      data: emojiReaction,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
    }

    const dimensions: Dimensions = { rows: 4, columns: 4 }

    const blocks: Block[] = [
      { x: 1, y: 1, direction: 'N', element: 'wall' },
      { x: 1, y: 2, direction: 'N', element: 'wall' },
    ]

    const grounds: Ground[] = [{ x: 1, y: 1, direction: 'N', texture: 'grass' }]

    const entry: Position = { x: 0, y: 0, direction: 'N' }

    const zones: Indexed<Position>[] = [
      { id: 'zone1', x: 2, y: 2, direction: 'N' },
      { id: 'zone2', x: 3, y: 3, direction: 'E' },
    ]

    const isConfiguring = true

    render(
      <Stage
        isConfiguring={isConfiguring}
        userPosition={userPosition}
        dimensions={dimensions}
        data={{ blocks, entry, grounds, zones }}
      />
    )

    expect(useSessionUser).toHaveBeenCalledWith()

    const walls = blocks

    expect(useDrawMainCanvas).toHaveBeenCalledWith(
      null,
      {
        zoom: BASE_ZOOM,
        cameraOffset,
      },
      {
        isConfiguring,
        dimensions,
        walls,
        entry,
        grounds,
        zones,
      }
    )
  })

  test('zooms in and out', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useUserMock.mockReturnValue({} as unknown as ReturnType<typeof useUser>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const user = userEvent.setup()

    render(
      <Stage
        userPosition={{
          id: 'USER_POSITION_ID',
          userId: 'USER_ID',
          spaceId: 'SPACE_ID',
          x: 0,
          y: 0,
          direction: 'N',
        }}
        dimensions={{ rows: 4, columns: 4 }}
        data={{
          blocks: [
            { x: 1, y: 1, direction: 'N', element: 'wall' },
            { x: 1, y: 2, direction: 'N', element: 'wall' },
          ],
          entry: { x: 0, y: 0, direction: 'N' },
          grounds: [],
          zones: null,
        }}
      />
    )

    await user.click(await screen.findByRole('button', { name: 'Zoom In' }))

    expect(useDrawMainCanvas).toHaveBeenCalledWith(
      screen.getByLabelText('Main Canvas'),
      expect.objectContaining({
        zoom: BASE_ZOOM + ZOOM_STEP * 1,
      }),
      expect.any(Object)
    )

    expect(useCameraOffset).toHaveBeenCalledWith(
      { current: screen.getByLabelText('Main Canvas') },
      expect.objectContaining({
        zoom: BASE_ZOOM + ZOOM_STEP * 1,
      })
    )

    await user.click(await screen.findByRole('button', { name: 'Zoom Out' }))

    expect(useDrawMainCanvas).toHaveBeenCalledWith(
      screen.getByLabelText('Main Canvas'),
      expect.objectContaining({
        zoom: BASE_ZOOM,
      }),
      expect.any(Object)
    )

    expect(useCameraOffset).toHaveBeenCalledWith(
      { current: screen.getByLabelText('Main Canvas') },
      expect.objectContaining({
        zoom: BASE_ZOOM,
      })
    )
  })

  test('renders characters', () => {
    const sessionUser = {
      id: 'USER_ID',
      displayName: 'John Doe',
      avatar: 'dog',
    }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const onlineUsers = [sessionUser.id, 'USER_2_ID', 'USER_3_ID']
    useOnlineUsersMock.mockReturnValue({
      data: onlineUsers,
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const users = [
      { id: onlineUsers[0], displayName: 'User 1', avatar: 'FEMALE_01' },
      { id: onlineUsers[1], displayName: 'User 2', avatar: 'FEMALE_01' },
      { id: onlineUsers[2], displayName: 'User 3', avatar: 'FEMALE_02' },
    ]
    useUserMock.mockImplementation(
      (userId) =>
        ({
          data: users.find((user) => user.id === userId),
        }) as unknown as ReturnType<typeof useUser>
    )

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
    }

    const userMovements = [
      {
        ...userPosition,
        isMoving: false,
      },
      {
        id: 'POSITION_ID1',
        userId: onlineUsers[1],
        spaceId: 'SPACE_ID',
        x: 1,
        y: 0,
        direction: 'E',
        isMoving: false,
      },
      {
        id: 'POSITION_ID1',
        userId: onlineUsers[2],
        spaceId: 'SPACE_ID',
        x: 1,
        y: 3,
        direction: 'E',
        isMoving: false,
      },
    ]
    useUserMovementsMock.mockReturnValue({
      data: userMovements,
    } as unknown as ReturnType<typeof useUserMovements>)

    const dimensions: Dimensions = { rows: 10, columns: 10 }

    const blocks: Block[] = [
      { x: 1, y: 1, direction: 'N', element: 'wall' },
      { x: 1, y: 2, direction: 'N', element: 'wall' },
    ]

    const entry: Position = { x: 0, y: 0, direction: 'N' }

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const cameraOffset: CameraOffset = { left: 0, top: 0 }

    useCameraOffsetMock.mockReturnValue(
      cameraOffset as unknown as ReturnType<typeof useCameraOffset>
    )

    render(
      <Stage
        userPosition={userPosition}
        dimensions={dimensions}
        data={{ blocks, entry, grounds: [], zones: null }}
      />
    )

    expect(useParams).toHaveBeenCalled()
    expect(useSpace).toHaveBeenCalledWith(spaceId)
    expect(useOnlineUsers).toHaveBeenCalledWith(space.id)
    expect(useUserMovements).toHaveBeenCalledWith(space.id)

    expect(screen.getAllByLabelText('Character Canvas')).toHaveLength(3)

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
      null,
      { zoom: BASE_ZOOM, cameraOffset },
      { user: users[0], movement: userMovements[0] }
    )

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
      null,
      { zoom: BASE_ZOOM, cameraOffset },
      { user: users[1], movement: userMovements[1] }
    )

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
      null,
      { zoom: BASE_ZOOM, cameraOffset },
      { user: users[2], movement: userMovements[2] }
    )
  })

  test('renders entered zone', () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: ['USER_ID'],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
    }

    useUserMovementsMock.mockReturnValue({
      data: [{ ...userPosition, isMoving: false }],
    } as unknown as ReturnType<typeof useUserMovements>)

    const dimensions: Dimensions = { rows: 10, columns: 10 }

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const cameraOffset: CameraOffset = { left: 0, top: 0 }

    useCameraOffsetMock.mockReturnValue(
      cameraOffset as unknown as ReturnType<typeof useCameraOffset>
    )

    render(
      <Stage
        userPosition={userPosition}
        dimensions={dimensions}
        data={{
          blocks: [],
          entry: { x: 0, y: 0, direction: 'N' },
          grounds: [],
          zones: [
            {
              id: 'ZONE_ID',
              x: userPosition.x,
              y: userPosition.y,
              direction: 'N',
            },
          ],
        }}
      />
    )

    expect(screen.getByLabelText('Entered Zone Canvas')).toBeInTheDocument()
  })

  test('does not render other characters and entered zone when is configuring', () => {
    const sessionUser = {
      id: 'USER_ID',
      displayName: 'John Doe',
      avatar: 'dog',
    }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const onlineUsers = [sessionUser.id, 'USER_2_ID', 'USER_3_ID']
    useOnlineUsersMock.mockReturnValue({
      data: onlineUsers,
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useUser>)

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
    }

    const userMovements = [
      {
        ...userPosition,
        isMoving: false,
      },
    ]
    useUserMovementsMock.mockReturnValue({
      data: userMovements,
    } as unknown as ReturnType<typeof useUserMovements>)

    const dimensions: Dimensions = { rows: 10, columns: 10 }

    const blocks: Block[] = [
      { x: 1, y: 1, direction: 'N', element: 'wall' },
      { x: 1, y: 2, direction: 'N', element: 'wall' },
    ]

    const entry: Position = { x: 0, y: 0, direction: 'N' }

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const cameraOffset: CameraOffset = { left: 0, top: 0 }

    useCameraOffsetMock.mockReturnValue(
      cameraOffset as unknown as ReturnType<typeof useCameraOffset>
    )

    render(
      <Stage
        isConfiguring
        userPosition={userPosition}
        dimensions={dimensions}
        data={{ blocks, entry, grounds: [], zones: null }}
      />
    )
    expect(screen.getAllByLabelText('Character Canvas')).toHaveLength(1)

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
      null,
      { zoom: BASE_ZOOM, cameraOffset },
      { user: sessionUser, movement: userMovements[0] }
    )

    expect(
      screen.queryByLabelText('Entered Zone Canvas')
    ).not.toBeInTheDocument()
  })

  test('updates space position with the character movement', async () => {
    const sessionUser = {
      id: 'USER_ID',
      displayName: 'John Doe',
      avatar: 'FEMALE_01',
    }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useUser>)

    const user = userEvent.setup()

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
    }

    render(
      <Stage
        userPosition={userPosition}
        dimensions={{ rows: 4, columns: 4 }}
        data={{
          blocks: [
            { x: 1, y: 1, direction: 'N', element: 'wall' },
            { x: 1, y: 2, direction: 'N', element: 'wall' },
          ],
          entry: { x: 0, y: 0, direction: 'N' },
          grounds: [],
          zones: null,
        }}
      />
    )

    await user.keyboard('{ArrowDown}')

    expect(useUpdateSpacePosition).toHaveBeenCalledWith({
      ...userPosition,
      isMoving: true,
      direction: 'S',
      y: 1,
    })

    expect(useUpdateSpacePosition).toHaveBeenCalledWith({
      ...userPosition,
      isMoving: false,
      direction: 'S',
      y: 1,
    })

    expect(useUser).toHaveBeenCalledWith(sessionUser.id)

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Object),
      {
        user: sessionUser,
        movement: {
          ...userPosition,
          isMoving: false,
          direction: 'S',
          y: 1,
        },
      }
    )
  })

  test('configures stage', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useUserMock.mockReturnValue({} as unknown as ReturnType<typeof useUser>)

    const cameraOffset: CameraOffset = { left: 0, top: 0 }

    useCameraOffsetMock.mockReturnValue(
      cameraOffset as unknown as ReturnType<typeof useCameraOffset>
    )

    const blocks: Block[] = [
      { x: 2, y: 1, direction: 'N', element: 'wall' },
      { x: 2, y: 2, direction: 'N', element: 'wall' },
    ]
    const entry: Position = { x: 0, y: 0, direction: 'N' }
    const grounds: Ground[] = [{ x: 1, y: 2, direction: 'N', texture: 'grass' }]
    const configItem: ConfigItem = { type: 'entry' }
    const dimensions = { rows: 4, columns: 4 }

    const configPosition: ConfigPosition = {
      type: configItem.type,
      x: 3,
      y: 3,
      direction: 'N',
    }

    useConfigPositionMock.mockReturnValue(configPosition)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(
      <Stage
        userPosition={{
          id: 'USER_POSITION_ID',
          userId: 'USER_ID',
          spaceId: 'SPACE_ID',
          x: 0,
          y: 0,
          direction: 'N',
        }}
        configItem={configItem}
        dimensions={dimensions}
        data={{ blocks, entry, grounds, zones: null }}
      />
    )

    await waitFor(() =>
      expect(useConfigPosition).toHaveBeenCalledWith(
        null,
        configItem,
        dimensions,
        { cameraOffset, zoom: BASE_ZOOM },
        {
          blocks,
          entry,
          grounds,
          zones: null,
        }
      )
    )

    await waitFor(() =>
      expect(useUpdateStageConfig).toHaveBeenCalledWith(undefined, {
        configPosition,
      })
    )
  })

  test('stops user from moving to blocks', async () => {
    const sessionUser = {
      id: 'USER_ID',
      displayName: 'John Doe',
      avatar: 'dog',
    }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useUserMock.mockReturnValue({} as unknown as ReturnType<typeof useUser>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
    }

    const entry: Position = { x: 0, y: 0, direction: 'N' }

    render(
      <Stage
        userPosition={userPosition}
        dimensions={{ rows: 4, columns: 4 }}
        data={{
          entry,
          blocks: [{ x: 0, y: 1, direction: 'N', element: 'wall' }],
          grounds: [],
          zones: null,
        }}
      />
    )

    fireEvent.keyDown(window, {
      key: 'ArrowDown',
    })

    await waitFor(() =>
      expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Object),
        expect.objectContaining({
          movement: {
            ...userPosition,
            isMoving: true,
            direction: 'S',
          },
        })
      )
    )
  })
})
