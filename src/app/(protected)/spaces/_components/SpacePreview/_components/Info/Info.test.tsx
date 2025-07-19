import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import deleteSpace from '@/db/deleteSpace'
import leaveSpace from '@/db/leaveSpace'
import useSessionUser from '@/hooks/useSessionUser'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useJoinedSpaces from '@/hooks/useJoinedSpaces'
import { VARIANT } from '@/components/Button'
import useUserPresences from '@/hooks/useUserPresences'
import Info from './Info'

vi.mock('@/db/deleteSpace')
vi.mock('@/db/leaveSpace')
vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)
vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)
vi.mock('@/hooks/useJoinedSpaces')
const useJoinedSpacesMock = vi.mocked(useJoinedSpaces)
vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

describe('Info', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders name', () => {
    useSessionUserMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    render(<Info name="Test Name" spaceId="SPACE_ID1" />)

    expect(screen.getByText('Test Name')).toBeInTheDocument()
  })

  test('renders time', () => {
    vi.useFakeTimers()

    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: new Date(Date.now() - 30000),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    render(<Info name="Test Name" spaceId={spaceId} />)

    expect(useSessionUserMock).toHaveBeenCalled()
    expect(useUserPresencesMock).toHaveBeenCalledWith(spaceId)

    expect(screen.getByRole('time', { name: 'Last seen at' })).toContainHTML(
      'a few seconds ago'
    )

    vi.useRealTimers()
  })

  test('does not renders time if not found valid last seen date', () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: '',
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    render(<Info name="Test Name" spaceId={spaceId} />)

    expect(screen.queryByRole('time', { name: 'Last seen at' })).toBeNull()
  })

  test('renders Option button', async () => {
    useSessionUserMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    render(<Info name="Test Name" spaceId="SPACE_ID1" />)

    expect(
      await screen.findByRole('button', { name: 'Options' })
    ).toBeInTheDocument()
  })

  test('renders secondary Button when Option button is clicked', async () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: new Date(Date.now() - 30000),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOwnedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    const user = userEvent.setup()
    render(<Info name="Test Name" spaceId={spaceId} />)

    expect(await screen.findByRole('button', { name: 'Options' })).toHaveClass(
      VARIANT.naked
    )
    await user.click(await screen.findByRole('button', { name: 'Options' }))

    expect(await screen.findByRole('button', { name: 'Options' })).toHaveClass(
      VARIANT.secondary
    )
  })

  test('renders Delete Button and delete this space when click the button', async () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: new Date(Date.now() - 30000),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOwnedSpacesMock.mockReturnValue({
      isLoading: false,
      data: [
        { id: 'SPACE_ID1', name: 'Owned Space 1' },
        { id: 'SPACE_ID2', name: 'Owned Space 2' },
      ],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    const user = userEvent.setup()
    render(<Info name="Test Name" spaceId={spaceId} />)
    await user.click(await screen.findByRole('button', { name: 'Options' }))
    expect(screen.getByText('Delete')).toBeInTheDocument()
    await user.click(screen.getByText('Delete'))
    expect(deleteSpace).toHaveBeenCalledWith(spaceId)
  })

  test('renders Leave Button and leave this space when click the button', async () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId,
          spaceId,
          lastSeenAt: new Date(Date.now() - 30000),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOwnedSpacesMock.mockReturnValue({
      isLoading: false,
      data: [{ id: 'SPACE_ID3', name: 'Owned Space 3' }],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    const user = userEvent.setup()
    render(<Info name="Test Name" spaceId={spaceId} />)
    await user.click(await screen.findByRole('button', { name: 'Options' }))
    expect(screen.getByText('Leave')).toBeInTheDocument()
    await user.click(screen.getByText('Leave'))
    expect(leaveSpace).toHaveBeenCalledWith({
      spaceId,
      userId,
    })
  })
})
