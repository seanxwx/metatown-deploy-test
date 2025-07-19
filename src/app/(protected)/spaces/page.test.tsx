import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VARIANT } from '@/components/Button'
import useJoinedSpaces from '@/hooks/useJoinedSpaces'
import useLastVisitedSpaces from '@/hooks/useLastVisitedSpaces'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useSearchSpaces from '@/hooks/useSearchSpaces'
import useSession from '@/hooks/useSession'
import useSessionUser from '@/hooks/useSessionUser'
import useSpacePresences from '@/hooks/useSpacePresences'
import useUserPresences from '@/hooks/useUserPresences'
import Home from './page'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)

vi.mock('@/hooks/useJoinedSpaces')
const useJoinedSpacesMock = vi.mocked(useJoinedSpaces)

vi.mock('@/hooks/useLastVisitedSpaces')
const useLastVisitedSpacesMock = vi.mocked(useLastVisitedSpaces)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useSpacePresences')
const useSpacePresencesMock = vi.mocked(useSpacePresences)

vi.mock('@/hooks/useSearchSpaces')
const useSearchSpacesMock = vi.mocked(useSearchSpaces)

describe('Home', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Header', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Home />)

    expect(screen.getByRole('link', { name: 'Meta Town' })).toBeInTheDocument()
  })

  test('renders Filter', () => {
    useOwnedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'Space ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Home />)

    expect(
      screen.getByRole('button', { name: 'Last visited' })
    ).toBeInTheDocument()
  })

  test('renders Spaces', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    render(<Home />)
    expect(
      screen.getByRole('group', { name: 'Last Visited Spaces' })
    ).toBeInTheDocument()
  })

  test('shows last visited spaces initially', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Home />)

    expect(
      screen.getByRole('group', { name: 'Last Visited Spaces' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('group', { name: 'Owned spaces' })
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Last visited' })).toHaveClass(
      VARIANT.primary
    )

    expect(screen.getByRole('button', { name: 'Created Spaces' })).toHaveClass(
      VARIANT.light
    )
  })

  test('shows owned spaces when Created Spaces button is clicked', async () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: new Date(Date.now() - 30000),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useOwnedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'Space ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    useJoinedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const user = userEvent.setup()

    render(<Home />)

    await user.click(screen.getByRole('button', { name: 'Created Spaces' }))
    expect(
      screen.getByRole('group', { name: 'Owned spaces' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('group', { name: 'Last Visited Spaces' })
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Last visited' })).toHaveClass(
      VARIANT.light
    )

    expect(screen.getByRole('button', { name: 'Created Spaces' })).toHaveClass(
      VARIANT.primary
    )
  })

  test('shows last visited spaces when Last visited button is clicked', async () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: new Date(Date.now() - 30000),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useOwnedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'Space ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    useJoinedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const user = userEvent.setup()

    render(<Home />)

    await user.click(screen.getByRole('button', { name: 'Created Spaces' }))
    await user.click(screen.getByRole('button', { name: 'Last visited' }))
    expect(
      screen.getByRole('group', { name: 'Last Visited Spaces' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('group', { name: 'Owned spaces' })
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Last visited' })).toHaveClass(
      VARIANT.primary
    )

    expect(screen.getByRole('button', { name: 'Created Spaces' })).toHaveClass(
      VARIANT.light
    )
  })

  test('shows search results when query length is at least 3 characters', async () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    useOwnedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    useSearchSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSearchSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const user = userEvent.setup()

    render(<Home />)

    await user.type(
      screen.getByRole('textbox', { name: 'Search' }),
      'Space Name'
    )

    expect(
      screen.getByRole('group', { name: 'Searched spaces' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('group', { name: 'Last Visited Spaces' })
    ).not.toBeInTheDocument()
  })

  test('calls useSearchSpaces only after user stops typing for a given time period', async () => {
    vi.useFakeTimers()

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSpacePresencesMock.mockReturnValue({
      data: [
        {
          spaceId: 'SPACE_ID04',
          status: 'OFFLINE',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSpacePresences>)

    useOwnedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    useSearchSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Test',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSearchSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    render(<Home />)

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'Tes')

    expect(useSearchSpacesMock).toHaveBeenCalledOnce()

    await act(() => vi.advanceTimersByTime(600))

    expect(useSearchSpacesMock).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})
