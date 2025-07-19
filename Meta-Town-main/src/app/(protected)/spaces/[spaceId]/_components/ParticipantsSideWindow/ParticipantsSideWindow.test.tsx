import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import useUserPresences from '@/hooks/useUserPresences'
import useUser from '@/hooks/useUser'
import useSpace from '@/hooks/useSpace'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import ParticipantsSideWindow, {
  sortUserPresences,
} from './ParticipantsSideWindow'

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useOnlineUsers')
const useOnlineUsersMock = vi.mocked(useOnlineUsers)

describe('ParticipantsSideWindow', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders header', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })
    useSpaceMock.mockReturnValue({ id: 'SPACE_ID' } as unknown as ReturnType<
      typeof useSpace
    >)

    useUserPresencesMock.mockReturnValue({
      isLoading: false,
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<ParticipantsSideWindow onClose={vi.fn()} />)

    expect(screen.getByText('Participants')).toBeInTheDocument()
  })

  test('renders side window', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })
    useSpaceMock.mockReturnValue({ id: 'SPACE_ID' } as unknown as ReturnType<
      typeof useSpace
    >)

    useUserPresencesMock.mockReturnValue({
      isLoading: false,
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<ParticipantsSideWindow onClose={vi.fn()} />)

    expect(
      screen.getByRole('region', { name: 'Participants Side Window' })
    ).toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })
    useSpaceMock.mockReturnValue({ id: 'SPACE_ID' } as unknown as ReturnType<
      typeof useSpace
    >)

    useUserPresencesMock.mockReturnValue({
      isLoading: false,
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<ParticipantsSideWindow onClose={handleClick} />)

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(handleClick).toBeCalled()
  })

  test('renders participants in side window', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    useParamsMock.mockReturnValue({ spaceId })
    useSpaceMock.mockReturnValue({
      data: {
        id: space.id,
      },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: ['USER_ID1', 'USER_ID3'],
    })

    useUserPresencesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          id: '2',
          userId: 'USER_ID2',
          status: 'OFFLINE',
        },
        {
          id: '1',
          userId: 'USER_ID1',
          status: 'ONLINE',
        },
        {
          id: '3',
          userId: 'USER_ID3',
          status: 'OFFLINE',
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useUserMock.mockImplementation((userId) => {
      if (userId === 'USER_ID1') {
        return {
          data: {
            id: '1',
            displayName: 'Alice',
            avatar: 'FEMALE_01',
          },
        } as unknown as ReturnType<typeof useUser>
      }

      if (userId === 'USER_ID2') {
        return {
          data: {
            id: '2',
            displayName: 'Bob',
            avatar: 'MALE_01',
          },
        } as unknown as ReturnType<typeof useUser>
      }

      if (userId === 'USER_ID3') {
        return {
          data: {
            id: '3',
            displayName: 'Charlie',
            avatar: 'MALE_01',
          },
        } as unknown as ReturnType<typeof useUser>
      }

      return {
        data: null,
      } as unknown as ReturnType<typeof useUser>
    })

    render(<ParticipantsSideWindow onClose={vi.fn()} />)

    expect(useParams).toHaveBeenCalled()
    expect(useSpace).toHaveBeenCalledWith(spaceId)
    expect(useUserPresences).toHaveBeenCalledWith(space.id)
    expect(useOnlineUsers).toHaveBeenCalledWith(space.id)

    expect(
      screen.getByRole('status', { name: "Alice's Status: ONLINE" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('status', { name: "Bob's Status: OFFLINE" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('status', { name: "Charlie's Status: ONLINE" })
    ).toBeInTheDocument()
  })

  test('does not render participants in side window if there is no presence users', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })
    useSpaceMock.mockReturnValue({ id: 'SPACE_ID' } as unknown as ReturnType<
      typeof useSpace
    >)

    useUserPresencesMock.mockReturnValue({
      isLoading: false,
      data: null,
    } as unknown as ReturnType<typeof useUserPresences>)

    useOnlineUsersMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<ParticipantsSideWindow onClose={vi.fn()} />)

    expect(await screen.findByRole('list')).toBeEmptyDOMElement()
  })
})

describe('sortUserPresences', () => {
  test('sorts user presences by status and id', () => {
    const userPresences: { id: string; status: 'ONLINE' | 'OFFLINE' }[] = [
      { id: 'A', status: 'ONLINE' },
      { id: 'Z', status: 'OFFLINE' },
      { id: 'C', status: 'ONLINE' },
      { id: 'B', status: 'OFFLINE' },
    ]

    const sortedUserPresences = userPresences.sort(sortUserPresences)

    expect(sortedUserPresences).toEqual([
      { id: 'A', status: 'ONLINE' },
      { id: 'C', status: 'ONLINE' },
      { id: 'B', status: 'OFFLINE' },
      { id: 'Z', status: 'OFFLINE' },
    ])
  })
})
