import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useSessionUser from '@/hooks/useSessionUser'
import deleteSpace from '@/db/deleteSpace'
import leaveSpace from '@/db/leaveSpace'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useJoinedSpaces from '@/hooks/useJoinedSpaces'
import DeleteOrLeaveButton from './DeleteOrLeaveButton'

vi.mock('@/db/deleteSpace')
vi.mock('@/db/leaveSpace')
vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)
vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)
vi.mock('@/hooks/useJoinedSpaces')
const useJoinedSpacesMock = vi.mocked(useJoinedSpaces)

describe('DeleteOrLeaveButton', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Delete button', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'USER_ID1',
      },
    } as unknown as ReturnType<typeof useSessionUser>)

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
    render(<DeleteOrLeaveButton spaceId="SPACE_ID1" />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  test('renders Leave button', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'USER_ID1',
      },
    } as unknown as ReturnType<typeof useSessionUser>)

    useOwnedSpacesMock.mockReturnValue({
      isLoading: false,
      data: [
        { id: 'SPACE_ID3', name: 'Owned Space 3' },
        { id: 'SPACE_ID4', name: 'Owned Space 4' },
      ],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useJoinedSpaces>)
    render(<DeleteOrLeaveButton spaceId="SPACE_ID1" />)
    expect(screen.getByText('Leave')).toBeInTheDocument()
  })

  test('calls deleteSpace when Delete button is clicked', async () => {
    const spaceId = 'SPACE_ID1'
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'USER_ID1',
      },
    } as unknown as ReturnType<typeof useSessionUser>)

    const mutate = vi.fn()
    useOwnedSpacesMock.mockReturnValue({
      isLoading: false,
      data: [
        { id: 'SPACE_ID1', name: 'Owned Space 1' },
        { id: 'SPACE_ID2', name: 'Owned Space 2' },
      ],
      mutate,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useJoinedSpaces>)
    const user = userEvent.setup()
    render(<DeleteOrLeaveButton spaceId={spaceId} />)
    await user.click(screen.getByText('Delete'))
    expect(deleteSpace).toHaveBeenCalledWith(spaceId)
    expect(mutate).toHaveBeenCalled()
  })

  test('calls leaveSpace when Leave button is clicked', async () => {
    const spaceId = 'SPACE_ID1'
    const userId = 'USER_ID1'
    const mutate = vi.fn()
    useSessionUserMock.mockReturnValue({
      data: {
        id: userId,
      },
    } as unknown as ReturnType<typeof useSessionUser>)

    useOwnedSpacesMock.mockReturnValue({
      isLoading: false,
      data: [
        { id: 'SPACE_ID3', name: 'Owned Space 3' },
        { id: 'SPACE_ID4', name: 'Owned Space 4' },
      ],
      mutate,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useJoinedSpaces>)
    const user = userEvent.setup()
    render(<DeleteOrLeaveButton spaceId={spaceId} />)
    await user.click(screen.getByText('Leave'))
    expect(leaveSpace).toHaveBeenCalledWith({
      spaceId,
      userId,
    })
    expect(mutate).toHaveBeenCalled()
  })

  test('does not call leaveSpace when there is no user', async () => {
    useSessionUserMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSessionUser>)

    useOwnedSpacesMock.mockReturnValue({
      isLoading: false,
      data: [
        { id: 'SPACE_ID3', name: 'Owned Space 3' },
        { id: 'SPACE_ID4', name: 'Owned Space 4' },
      ],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useJoinedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useJoinedSpaces>)
    const user = userEvent.setup()
    render(<DeleteOrLeaveButton spaceId="SPACE_ID1" />)
    await user.click(screen.getByText('Leave'))
    expect(leaveSpace).not.toHaveBeenCalled()
  })
})
