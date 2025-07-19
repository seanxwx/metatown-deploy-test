import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { VARIANT } from '@/components/Button'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useProducers from '@/hooks/useProducers'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUser from '@/hooks/useUser'
import useUserMovements from '@/hooks/useUserMovements'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import { Indexed, Position } from '@/app/types'
import Meeting from './Meeting'
import useLayout from './_components/Layout/_hooks/useLayout'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useUserMovements')
const useUserMovementsMock = vi.mocked(useUserMovements)

vi.mock('@/hooks/useOnlineUsers')
const useOnlineUsersMock = vi.mocked(useOnlineUsers)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useProducers')
const useProducersMock = vi.mocked(useProducers)

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('./_components/Layout/_hooks/useLayout')
const useLayoutMock = vi.mocked(useLayout)

describe('Meeting', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('does not render the meeting when there are no nearby user presences', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    useSessionUserMock.mockReturnValue({} as ReturnType<typeof useSessionUser>)
    useUserMovementsMock.mockReturnValue(
      {} as ReturnType<typeof useUserMovements>
    )

    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: ['USER_ID'],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useUser>)

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    const { container } = render(
      <Meeting
        mediasoupClient={{
          consume: vi.fn(),
          produce: vi.fn(),
        }}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('does not render the meeting when mediasoupClient is not provided', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    const users = [
      { id: 'USER_ID1', displayName: 'Alice', avatar: 'bird' },
      { id: 'USER_ID2', displayName: 'Bob', avatar: 'dog' },
    ]

    useProducersMock.mockReturnValue({
      data: [
        {
          userId: users[0].id,
          producerId: 'PRODUCER_ID1',
          state: 'ACTIVE',
          kind: 'video',
        },
        {
          userId: users[1].id,
          producerId: 'PRODUCER_ID2',
          state: 'ACTIVE',
          kind: 'video',
        },
      ],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({ data: users[0] } as ReturnType<
      typeof useSessionUser
    >)

    useUserMovementsMock.mockReturnValue({
      data: [
        { userId: users[0].id, x: 0, y: 0 },
        { userId: users[1].id, x: 0, y: 1 },
      ],
    } as ReturnType<typeof useUserMovements>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [users[0].id, users[1].id],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockImplementation((userId) => {
      const user = users.find(({ id }) => userId === id)

      return {
        data: user,
      } as unknown as ReturnType<typeof useUser>
    })

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    const { container } = render(<Meeting />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders meeting and Meeting view IconButton', async () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    const users = [
      { id: 'USER_ID1', displayName: 'Alice', avatar: 'bird' },
      { id: 'USER_ID2', displayName: 'Bob', avatar: 'dog' },
    ]

    useProducersMock.mockReturnValue({
      data: [
        {
          id: 'PRODUCER_ID1',
          userId: users[0].id,
          producerId: 'PRODUCER_ID1',
          state: 'ACTIVE',
          kind: 'video',
        },
        {
          id: 'PRODUCER_ID2',
          userId: users[1].id,
          producerId: 'PRODUCER_ID2',
          state: 'ACTIVE',
          kind: 'video',
        },
      ],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({ data: users[0] } as ReturnType<
      typeof useSessionUser
    >)

    useUserMovementsMock.mockReturnValue({
      data: [
        { userId: users[0].id, x: 0, y: 0 },
        { userId: users[1].id, x: 0, y: 1 },
      ],
    } as ReturnType<typeof useUserMovements>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [users[0].id, users[1].id],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockImplementation((userId) => {
      const user = users.find(({ id }) => userId === id)

      return {
        data: user,
      } as unknown as ReturnType<typeof useUser>
    })

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    render(
      <Meeting
        mediasoupClient={{
          consume: vi.fn(),
          produce: vi.fn(),
        }}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Meeting view' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Map view' })
    ).toBeInTheDocument()
  })

  test('renders MapView and does not render MeetingView by default', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    const users = [
      { id: 'USER_ID1', displayName: 'Alice', avatar: 'bird' },
      { id: 'USER_ID2', displayName: 'Bob', avatar: 'dog' },
    ]

    useSessionUserMock.mockReturnValue({ data: users[0] } as ReturnType<
      typeof useSessionUser
    >)

    useUserMovementsMock.mockReturnValue({
      data: [
        { userId: users[0].id, x: 0, y: 0 },
        { userId: users[1].id, x: 0, y: 1 },
      ],
    } as ReturnType<typeof useUserMovements>)

    useProducersMock.mockReturnValue({
      data: [
        {
          id: 'PRODUCER_ID1',
          userId: users[0].id,
          producerId: 'PRODUCER_ID1',
          state: 'ACTIVE',
          kind: 'video',
        },
        {
          id: 'PRODUCER_ID2',
          userId: users[1].id,
          producerId: 'PRODUCER_ID2',
          state: 'ACTIVE',
          kind: 'video',
        },
      ],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [users[0].id, users[1].id],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockImplementation((userId) => {
      const user = users.find(({ id }) => userId === id)

      return {
        data: user,
      } as unknown as ReturnType<typeof useUser>
    })

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    render(
      <Meeting
        mediasoupClient={{
          consume: vi.fn(),
          produce: vi.fn(),
        }}
      />
    )

    expect(screen.getByRole('region', { name: 'Map' })).toBeInTheDocument()

    expect(
      screen.queryByRole('region', { name: 'Meeting' })
    ).not.toBeInTheDocument()
  })

  test('renders MeetingView when meeting view button is clicked', async () => {
    const spaceId = 'SPACE_ID'

    const space = { id: 'SPACE_ID' }

    const users = [
      { id: 'USER_ID1', displayName: 'Alice', avatar: 'bird' },
      { id: 'USER_ID2', displayName: 'Bob', avatar: 'dog' },
      { id: 'USER_ID3', displayName: 'David', avatar: 'cat' },
    ]

    const producers = [
      {
        id: 'PRODUCER_ID1',
        userId: users[0].id,
        producerId: 'PRODUCER_ID1',
        state: 'ACTIVE',
        kind: 'video',
      },
      {
        id: 'PRODUCER_ID2',
        userId: users[1].id,
        producerId: 'PRODUCER_ID2',
        state: 'PAUSED',
        kind: 'video',
      },
      {
        id: 'PRODUCER_ID3',
        userId: users[2].id,
        producerId: 'PRODUCER_ID3',
        state: 'ACTIVE',
        kind: 'video',
      },
      {
        id: 'PRODUCER_ID4',
        userId: users[2].id,
        producerId: 'PRODUCER_ID4',
        state: 'ACTIVE',
        kind: 'audio',
      },
    ]

    useSessionUserMock.mockReturnValue({
      data: users[1],
    } as ReturnType<typeof useSessionUser>)

    useUserMovementsMock.mockReturnValue({
      data: [
        { userId: users[0].id, x: 0, y: 0 },
        { userId: users[1].id, x: 0, y: 0 },
        { userId: users[2].id, x: 0, y: 3 },
      ],
    } as ReturnType<typeof useUserMovements>)

    useProducersMock.mockReturnValue({
      data: producers,
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [users[1].id, users[2].id],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockImplementation((userId) => {
      const user = users.find(({ id }) => userId === id)

      return {
        data: user,
      } as unknown as ReturnType<typeof useUser>
    })

    const user = userEvent.setup()

    const mediaSoupClient = {
      consume: vi.fn(),
      produce: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    render(<Meeting mediasoupClient={mediaSoupClient} />)

    await user.click(
      await screen.findByRole('button', { name: 'Meeting view' })
    )

    expect(useParams).toHaveBeenCalled()
    expect(useSpaceMock).toHaveBeenCalledWith(spaceId)
    expect(useOnlineUsersMock).toHaveBeenCalledWith(space.id)
    expect(useProducersMock).toHaveBeenCalledWith(space.id)
    expect(useUserMovementsMock).toHaveBeenCalledWith(space.id)

    expect(screen.getByRole('region', { name: 'Meeting' })).toBeInTheDocument()

    expect(
      screen.getByRole('presentation', { name: 'Overlay' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Meeting view' })
    ).toHaveClass(VARIANT.primary)

    expect(
      screen.queryByRole('region', { name: 'Map' })
    ).not.toBeInTheDocument()
  })

  test('renders MapView when map view button is clicked', async () => {
    const spaceId = 'SPACE_ID'

    const space = { id: 'SPACE_ID' }

    const users = [
      { id: 'USER_ID1', displayName: 'Alice', avatar: 'bird' },
      { id: 'USER_ID2', displayName: 'Bob', avatar: 'dog' },
      { id: 'USER_ID3', displayName: 'David', avatar: 'cat' },
    ]

    const producers = [
      {
        id: 'PRODUCER_ID1',
        userId: users[0].id,
        producerId: 'PRODUCER_ID1',
        state: 'ACTIVE',
        kind: 'video',
      },
      {
        id: 'PRODUCER_ID2',
        userId: users[1].id,
        producerId: 'PRODUCER_ID2',
        state: 'PAUSED',
        kind: 'video',
      },
      {
        id: 'PRODUCER_ID3',
        userId: users[2].id,
        producerId: 'PRODUCER_ID3',
        state: 'ACTIVE',
        kind: 'video',
      },
    ]

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useSessionUserMock.mockReturnValue({
      data: users[1],
    } as ReturnType<typeof useSessionUser>)

    useUserMovementsMock.mockReturnValue({
      data: [
        { userId: users[0].id, x: 0, y: 0 },
        { userId: users[1].id, x: 0, y: 0 },
        { userId: users[2].id, x: 0, y: 3 },
      ],
    } as ReturnType<typeof useUserMovements>)

    useProducersMock.mockReturnValue({
      data: producers,
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [users[1].id, users[2].id],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockImplementation((userId) => {
      const user = users.find(({ id }) => userId === id)

      return {
        data: user,
      } as unknown as ReturnType<typeof useUser>
    })

    const user = userEvent.setup()

    const mediaSoupClient = {
      consume: vi.fn(),
      produce: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    render(<Meeting mediasoupClient={mediaSoupClient} />)

    await user.click(
      await screen.findByRole('button', { name: 'Meeting view' })
    )

    await user.click(await screen.findByRole('button', { name: 'Map view' }))

    expect(useParams).toHaveBeenCalled()
    expect(useSpaceMock).toHaveBeenCalledWith(spaceId)
    expect(useOnlineUsersMock).toHaveBeenCalledWith(space.id)
    expect(useProducersMock).toHaveBeenCalledWith(space.id)

    expect(
      screen.queryByRole('presentation', { name: 'Overlay' })
    ).not.toBeInTheDocument()

    expect(screen.getByRole('region', { name: 'Map' })).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: 'Map view' })).toHaveClass(
      VARIANT.primary
    )

    expect(
      screen.queryByRole('region', { name: 'Meeting' })
    ).not.toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Meeting view' })
    ).toHaveClass(VARIANT.secondary)
  })

  test('renders null if no mediasoupClient', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    useSessionUserMock.mockReturnValue({} as ReturnType<typeof useSessionUser>)
    useUserMovementsMock.mockReturnValue(
      {} as ReturnType<typeof useUserMovements>
    )

    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: ['USER_ID'],
    } as ReturnType<typeof useOnlineUsers>)

    useUserMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useUser>)

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    const { container } = render(<Meeting />)

    expect(container).toBeEmptyDOMElement()
  })

  test('does not render meeting when user is alone', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    const users = [
      { id: 'USER_ID1', displayName: 'Alice', avatar: 'bird' },
      { id: 'USER_ID2', displayName: 'Bob', avatar: 'dog' },
    ]

    const producers = [
      { userId: users[0].id, producerId: 'PRODUCER_ID1', state: 'ACTIVE' },
      { userId: users[1].id, producerId: 'PRODUCER_ID2', state: 'ACTIVE' },
    ]

    useSessionUserMock.mockReturnValue({
      data: users[0],
    } as ReturnType<typeof useSessionUser>)

    useUserMovementsMock.mockReturnValue({
      data: [
        { userId: users[0].id, x: 0, y: 0 },
        { userId: users[1].id, x: 0, y: 10 },
      ],
    } as ReturnType<typeof useUserMovements>)

    useProducersMock.mockReturnValue({
      data: producers,
    } as unknown as ReturnType<typeof useProducersMock>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [users[0].id, users[1].id],
    } as ReturnType<typeof useOnlineUsers>)

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useUserMock.mockImplementation((userId) => {
      const user = users.find(({ id }) => userId === id)

      return {
        data: user,
      } as unknown as ReturnType<typeof useUser>
    })

    useLayoutMock.mockReturnValue({
      columns: 5,
      rows: 5,
    })

    render(
      <Meeting
        mediasoupClient={{
          consume: vi.fn(),
          produce: vi.fn(),
        }}
      />
    )

    expect(screen.queryByText(users[1].displayName)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('region', { name: 'Map' })
    ).not.toBeInTheDocument()
  })

  test.each([
    ['user', [{ userId: 'USER_ID1', x: 0, y: 0 }]],
    ['participant', [{ userId: 'USER_ID2', x: 0, y: 0 }]],
  ])(
    'does not render the meeting for a participant when %s lacks coordinate information',
    (_, userPositions) => {
      const spaceId = 'SPACE_ID'
      const space = { id: spaceId }

      const users = [
        { id: 'USER_ID1', displayName: 'Alice', avatar: 'cat' },
        { id: 'USER_ID2', displayName: 'Bob', avatar: 'cat' },
      ]

      useEmojiReactionMock.mockReturnValue({
        data: null,
      } as unknown as ReturnType<typeof useEmojiReaction>)

      useSessionUserMock.mockReturnValue({
        data: users[0],
      } as ReturnType<typeof useSessionUser>)

      useUserMovementsMock.mockReturnValue({
        data: userPositions,
      } as ReturnType<typeof useUserMovements>)

      useProducersMock.mockReturnValue({
        data: [
          {
            userId: users[0].id,
            producerId: 'PRODUCER_ID1',
            state: 'ACTIVE',
            kind: 'video',
          },
          {
            userId: users[1].id,
            producerId: 'PRODUCER_ID2',
            state: 'ACTIVE',
            kind: 'video',
          },
        ],
      } as unknown as ReturnType<typeof useProducersMock>)

      useParamsMock.mockReturnValue({ spaceId })

      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      useOnlineUsersMock.mockReturnValue({
        data: [users[0].id, users[1].id],
      } as ReturnType<typeof useOnlineUsers>)

      useUserMock.mockImplementation((userId) => {
        const user = users.find(({ id }) => userId === id)

        return {
          data: user,
        } as unknown as ReturnType<typeof useUser>
      })

      useLayoutMock.mockReturnValue({ columns: 5, rows: 5 })

      render(
        <Meeting
          mediasoupClient={{
            consume: vi.fn(),
            produce: vi.fn(),
          }}
        />
      )

      expect(
        screen.queryByRole('region', { name: 'Map' })
      ).not.toBeInTheDocument()

      expect(
        screen.queryByRole('region', { name: 'Meeting' })
      ).not.toBeInTheDocument()
    }
  )

  test.each([
    {
      userPosition: { userId: 'USER_ID1', x: 0, y: 0 },
      participantPosition: { userId: 'USER_ID2', x: 10, y: 10 },
    },
    {
      userPosition: { userId: 'USER_ID1', x: 10, y: 10 },
      participantPosition: { userId: 'USER_ID2', x: 0, y: 0 },
    },
    {
      userPosition: { userId: 'USER_ID1', x: 0, y: 0 },
      participantPosition: { userId: 'USER_ID2', x: 5, y: 5 },
    },
    {
      userPosition: { userId: 'USER_ID1', x: 5, y: 5 },
      participantPosition: { userId: 'USER_ID2', x: 0, y: 0 },
    },
  ])(
    'does not render the meeting when user is not in the same zone',
    ({ userPosition, participantPosition }) => {
      const zones: Indexed<Position>[] = [
        { id: 'ZONE1', x: 0, y: 0, direction: 'N' },
        { id: 'ZONE2', x: 10, y: 10, direction: 'N' },
      ]

      useSessionUserMock.mockReturnValue({
        data: { id: userPosition.userId },
      } as ReturnType<typeof useSessionUser>)

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
      } as ReturnType<typeof useOnlineUsers>)

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

      useLayoutMock.mockReturnValue({ columns: 5, rows: 5 })

      render(
        <Meeting
          mediasoupClient={{
            consume: vi.fn(),
            produce: vi.fn(),
          }}
          zones={zones}
        />
      )

      expect(screen.queryByText(user.displayName)).not.toBeInTheDocument()

      expect(
        screen.queryByText(participant.displayName)
      ).not.toBeInTheDocument()
    }
  )

  test('renders the meeting when user is in the same zone', () => {
    const zones: Indexed<Position>[] = [
      { id: 'ZONE1', x: 0, y: 0, direction: 'N' },
      { id: 'ZONE1', x: 0, y: 1, direction: 'N' },
      { id: 'ZONE2', x: 10, y: 10, direction: 'N' },
    ]

    const userPosition = { userId: 'USER_ID1', x: 0, y: 0 }
    const participantPosition = { userId: 'USER_ID2', x: 0, y: 1 }

    useSessionUserMock.mockReturnValue({
      data: { id: userPosition.userId },
    } as ReturnType<typeof useSessionUser>)

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
    } as ReturnType<typeof useOnlineUsers>)

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
      rows: 5,
    })

    render(
      <Meeting
        mediasoupClient={{
          consume: vi.fn(),
          produce: vi.fn(),
        }}
        zones={zones}
      />
    )

    expect(screen.getByText(user.displayName)).toBeInTheDocument()
    expect(screen.getByText(participant.displayName)).toBeInTheDocument()
  })
})
