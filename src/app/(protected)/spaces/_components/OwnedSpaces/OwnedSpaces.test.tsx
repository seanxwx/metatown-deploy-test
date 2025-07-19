import { screen, render } from '@testing-library/react'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useSessionUser from '@/hooks/useSessionUser'
import useUserPresences from '@/hooks/useUserPresences'
import OwnedSpaces from './OwnedSpaces'

vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

describe('OwnedSpaces', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  test('calls useOwnedSpaces', () => {
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
      data: [
        { id: '1', name: 'Space 1' },
        { id: '2', name: 'Space 2' },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    render(<OwnedSpaces />)
    expect(useOwnedSpaces).toHaveBeenCalled()
  })

  test('renders Loading when useOwnedSpaces is loading', () => {
    useOwnedSpacesMock.mockReturnValue({
      data: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    render(<OwnedSpaces />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  test('renders owned spaces when useOwnedSpaces is not loading', () => {
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
      data: [
        { id: '1', name: 'Space 1' },
        { id: '2', name: 'Space 2' },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    render(<OwnedSpaces />)

    expect(
      screen.getByRole('group', { name: 'Owned spaces' })
    ).toBeInTheDocument()
  })
})
