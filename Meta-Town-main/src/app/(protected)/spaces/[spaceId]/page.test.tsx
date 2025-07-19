import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { Indexed, Position } from '@/app/types'
import { VARIANT } from '@/components/Button'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useLastVisitedSpaces from '@/hooks/useLastVisitedSpaces'
import useMediasoupClient from '@/hooks/useMediasoupClient'
import useMessages from '@/hooks/useMessages'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useProducers from '@/hooks/useProducers'
import useRecorder from '@/hooks/useRecorder'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useSpacePosition from '@/hooks/useSpacePosition'
import useStageConfig from '@/hooks/useStageConfig'
import useUser from '@/hooks/useUser'
import useUserMovements from '@/hooks/useUserMovements'
import useUserPresences from '@/hooks/useUserPresences'
import useLayout from './_components/Meeting/_components/Layout/_hooks/useLayout'
import useDrawCharacterCanvas from './_components/Stage/_components/Character/_hooks/useDrawCharacterCanvas'
import useConfigPosition from './_components/Stage/_hooks/useConfigPosition'
import useDrawMainCanvas from './_components/Stage/_hooks/useDrawMainCanvas'
import useSyncSpacePresence from './_hooks/useSyncSpacePresence'
import Space from './page'

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpacePosition')
const useSpacePositionMock = vi.mocked(useSpacePosition)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useOnlineUsers')
const useOnlineUsersMock = vi.mocked(useOnlineUsers)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useStageConfig')
const useStageConfigMock = vi.mocked(useStageConfig)

vi.mock('@/hooks/useUserMovements')
const useUserMovementsMock = vi.mocked(useUserMovements)

vi.mock('./_hooks/useSyncSpacePresence')

vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)

vi.mock('@/hooks/useMessages')
const useMessagesMock = vi.mocked(useMessages)

vi.mock('@/hooks/useProducers')
const useProducersMock = vi.mocked(useProducers)

vi.mock('@/hooks/useMediasoupClient')
const useMediasoupClientMock = vi.mocked(useMediasoupClient)

vi.mock('@/hooks/useLastVisitedSpaces')
const useLastVisitedSpacesMock = vi.mocked(useLastVisitedSpaces)

vi.mock('@tiptap/core')

vi.mock('./_components/Stage/_hooks/useDrawMainCanvas')

vi.mock('./_components/Stage/_hooks/useConfigPosition')

vi.mock('./_components/Stage/_hooks/useUpdateSpacePosition')

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('./_components/Meeting/_components/Layout/_hooks/useLayout')
const useLayoutMock = vi.mocked(useLayout)

vi.mock(
  './_components/Stage/_components/Character/_hooks/useDrawCharacterCanvas'
)

vi.mock('@/hooks/useRecorder')
const useRecorderMock = vi.mocked(useRecorder)

describe('Space', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders loading when useStageConfig is loading', () => {
    useStageConfigMock.mockReturnValue({
      isLoading: true,
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({} as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()
  })

  test('renders loading when useSpacePosition is loading', () => {
    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      isLoading: true,
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({} as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()
  })

  test('renders not found when useSpace returns null', () => {
    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({} as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const { container } = render(<Space />)

    expect(container).toBeEmptyDOMElement()
  })

  test('calls useSpace with spaceId from params', () => {
    const spaceId = 'SPACE_ID'

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      isLoading: true,
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(useSpace).toHaveBeenCalledWith(spaceId)
  })

  test('renders Header', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    expect(
      screen.getByRole('button', { name: 'All-Hands' })
    ).toBeInTheDocument()
  })

  test('calls useSyncSpacePresence hook when rendering Space page', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    expect(useSyncSpacePresence).toHaveBeenCalled()
  })

  test('does not render Stage if there is no stage config', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(
      screen.queryByRole('grid', { name: 'Tiled Map' })
    ).not.toBeInTheDocument()
  })

  test('does not render Stage if there is no user position', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(
      screen.queryByRole('grid', { name: 'Tiled Map' })
    ).not.toBeInTheDocument()
  })

  test('renders Stage', async () => {
    const blocks = [{ x: 1, y: 2, direction: 'N', element: 'wall' }]
    const entry = { x: 1, y: 1, direction: 'N' }
    const grounds = [{ x: 2, y: 2, direction: 'N' }]
    const dimensions = { rows: 4, columns: 4 }

    const zones = [
      { id: 'zone1', x: 3, y: 3, width: 2, height: 2 },
      { id: 'zone2', x: 0, y: 0, width: 1, height: 1 },
    ]

    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: dimensions.rows,
        columns: dimensions.columns,
        blocks,
        entry,
        grounds,
        zones,
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    const walls = blocks

    render(<Space />)

    await waitFor(() =>
      expect(useDrawMainCanvas).toHaveBeenCalledWith(
        null,
        expect.any(Object),
        expect.objectContaining({
          isConfiguring: false,
          dimensions,
          walls,
          entry,
          grounds,
          zones,
        })
      )
    )
  })

  test('renders Footer', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useMediasoupClientMock.mockReturnValue({
      produce: vi.fn(),
      consume: vi.fn(),
    })

    useRecorderMock.mockReturnValue({
      mediaRecorder: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaRecorder,
    } as unknown as ReturnType<typeof useRecorder>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    expect(
      screen.getByLabelText('Participant Status: Available')
    ).toBeInTheDocument()

    expect(useMediasoupClient).toHaveBeenCalled()

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toBeInTheDocument()

    expect(useRecorder).toHaveBeenCalled()

    expect(
      await screen.findByRole('button', { name: 'Start Recording' })
    ).toBeInTheDocument()
  })

  test('toggles ChatSideWindow', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          content: 'Hello World',
          createdAt: '2021-01-01T00:00:00.000Z',
          id: 'ID',
          senderId: 'SENDER_ID',
        },
      ],
    } as unknown as ReturnType<typeof useMessages>)

    const user = userEvent.setup()

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await user.click(await screen.findByRole('button', { name: 'Chat' }))

    expect(
      screen.getByRole('region', { name: 'Chat Side Window' })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Chat' })).toHaveClass(
      VARIANT.secondary
    )

    await user.click(await screen.findByRole('button', { name: 'Chat' }))

    expect(
      screen.queryByRole('region', { name: 'Chat Side Window' })
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Chat' })).toHaveClass(
      VARIANT.naked
    )
  })

  test('closes ChatSideWindow on click side window close button', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    const user = userEvent.setup()

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          content: 'Hello World',
          createdAt: '2021-01-01T00:00:00.000Z',
          id: 'ID',
          senderId: 'SENDER_ID',
        },
      ],
    } as unknown as ReturnType<typeof useMessages>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await user.click(await screen.findByRole('button', { name: 'Chat' }))

    expect(
      screen.getByRole('region', { name: 'Chat Side Window' })
    ).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(
      screen.queryByRole('region', { name: 'Chat Side Window' })
    ).not.toBeInTheDocument()
  })

  test('toggles ParticipantsSideWindow', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    const user = userEvent.setup()

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await user.click(
      await screen.findByRole('button', { name: 'Participants' })
    )

    expect(
      screen.getByRole('region', { name: 'Participants Side Window' })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Participants' })).toHaveClass(
      VARIANT.secondary
    )

    await user.click(
      await screen.findByRole('button', { name: 'Participants' })
    )

    expect(
      screen.queryByRole('region', { name: 'Participants Side Window' })
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Participants' })).toHaveClass(
      VARIANT.underline
    )
  })

  test('closes ParticipantsSideWindow on click side window close button', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    const user = userEvent.setup()

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await user.click(
      await screen.findByRole('button', { name: 'Participants' })
    )

    expect(
      screen.getByRole('region', { name: 'Participants Side Window' })
    ).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(
      screen.queryByRole('region', { name: 'Participants Side Window' })
    ).not.toBeInTheDocument()
  })

  test('renders stage configuration', async () => {
    const entry = { x: 1, y: 1, direction: 'N' }

    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry,
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 2, y: 2, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    const space = { id: 'SPACE_ID', name: 'All-Hands' }

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    const user = userEvent.setup()

    useOwnedSpacesMock.mockReturnValue({
      data: [space],
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await user.click(
      await screen.findByRole('button', { name: 'More options' })
    )

    await user.click(screen.getByRole('button', { name: 'Edit Space' }))

    expect(
      screen.getByRole('dialog', { name: 'Configuration' })
    ).toBeInTheDocument()

    expect(useDrawMainCanvas).toHaveBeenCalledWith(
      expect.any(HTMLCanvasElement),
      expect.any(Object),
      expect.objectContaining({
        isConfiguring: true,
      })
    )

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(
      screen.queryByRole('dialog', { name: 'Configuration' })
    ).not.toBeInTheDocument()
  })

  test('configures walls', async () => {
    const stageConfig = {
      rows: 4,
      columns: 4,
      blocks: [],
      entry: { x: 1, y: 1, direction: 'N' },
    }
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: stageConfig,
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    const space = { id: 'SPACE_ID', name: 'All-Hands' }

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    const user = userEvent.setup()

    useOwnedSpacesMock.mockReturnValue({
      data: [space],
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await user.click(
      await screen.findByRole('button', { name: 'More options' })
    )

    await user.click(screen.getByRole('button', { name: 'Edit Space' }))

    await user.click(
      await screen.findByRole('button', { name: 'Asset: wall - N' })
    )

    await waitFor(
      () =>
        expect(useConfigPosition).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          {
            direction: 'N',
            type: 'blocks',
            element: 'wall',
          },
          { rows: stageConfig.rows, columns: stageConfig.columns },
          expect.any(Object),
          expect.any(Object)
        ),
      { timeout: 1000 }
    )
  })

  test('renders configuration by default when stage config is not available', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(
      screen.getByRole('dialog', { name: 'Configuration' })
    ).toBeInTheDocument()
  })

  test('renders configuration by default when user position is not available', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Space />)

    expect(
      screen.getByRole('dialog', { name: 'Configuration' })
    ).toBeInTheDocument()
  })

  test('renders character initial position using space position', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useStageConfigMock.mockReturnValue({
      data: {
        rows: 4,
        columns: 4,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' },
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    const userPosition = {
      id: 'USER_POSITION_ID',
      spaceId: 'SPACE_ID',
      userId: 'USER_ID',
      x: 2,
      y: 2,
      direction: 'N',
    }

    useSpacePositionMock.mockReturnValue({
      data: userPosition,
    } as unknown as ReturnType<typeof useSpacePosition>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useSessionUser>)

    const user = { id: 'ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useUserPresences>
    )

    useOnlineUsersMock.mockReturnValue({
      data: [],
    })

    useUserMovementsMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserMovements>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useEmojiReactionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useEmojiReaction>
    )

    render(<Space />)

    await waitFor(() =>
      expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
        null,
        expect.any(Object),
        expect.objectContaining({
          movement: expect.objectContaining(userPosition),
        })
      )
    )
  })

  test('renders participants in the same zone', () => {
    const zones: Indexed<Position>[] = [
      { id: 'ZONE1', x: 0, y: 0, direction: 'N' },
      { id: 'ZONE1', x: 0, y: 1, direction: 'N' },
      { id: 'ZONE2', x: 10, y: 10, direction: 'N' },
    ]

    const userPosition = { userId: 'USER_ID1', x: 0, y: 0 }
    const participantPosition = { userId: 'USER_ID2', x: 0, y: 1 }

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: {
        zones,
      },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 1, y: 1, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useMediasoupClientMock.mockReturnValue({
      produce: vi.fn(),
      consume: vi.fn(),
    } as unknown as ReturnType<typeof useMediasoupClient>)

    useSessionUserMock.mockReturnValue({
      data: { id: userPosition.userId },
    } as ReturnType<typeof useSessionUser>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useUserMovementsMock.mockReturnValue({
      data: [userPosition, participantPosition],
    } as ReturnType<typeof useUserMovements>)

    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducersMock>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [userPosition.userId, participantPosition.userId],
    })

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          id: 'USER_PRESENCE1',
          userId: userPosition.userId,
          spaceId: 'SPACE_ID',
          status: 'ONLINE',
        },
        {
          id: 'USER_PRESENCE2',
          userId: participantPosition.userId,
          spaceId: 'SPACE_ID',
          status: 'ONLINE',
        },
      ],
    } as ReturnType<typeof useUserPresences>)

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const user = {
      id: userPosition.userId,
      displayName: 'User',
    }

    const participant = {
      id: participantPosition.userId,
      displayName: 'Participant',
    }

    useUserMock.mockImplementation((userId) => {
      let data

      if (userId === userPosition.userId) {
        data = user
      }

      if (userId === participantPosition.userId) {
        data = participant
      }

      return { data } as unknown as ReturnType<typeof useUser>
    })

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 4,
    })

    render(<Space />)

    expect(screen.getByText(user.displayName)).toBeInTheDocument()
    expect(screen.getByText(participant.displayName)).toBeInTheDocument()
  })
})
