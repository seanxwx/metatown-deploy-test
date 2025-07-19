import { screen, render } from '@testing-library/react'
import dayjs from 'dayjs'
import useSessionUser from '@/hooks/useSessionUser'
import useUserPresences from '@/hooks/useUserPresences'
import useLastVisitedSpaces from '@/hooks/useLastVisitedSpaces'
import LastVisitedSpaces from './LastVisitedSpaces'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useLastVisitedSpaces')
const useLastVisitedSpacesMock = vi.mocked(useLastVisitedSpaces)

describe('LastVisitedSpaces', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  test('renders last visited spaces', () => {
    const lastVisitedSpaces = [
      {
        id: 'SPACE_ID01',
        name: 'JOINED SPACES01',
        lastSeenAt: '2021-01-01T00:00:00.000Z',
      },
    ]

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID1' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          userId: 'USER_ID1',
          spaceId: 'SPACE_ID03',
          lastSeenAt: dayjs(),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: lastVisitedSpaces,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<LastVisitedSpaces />)

    expect(
      screen.getByRole('group', { name: 'Last Visited Spaces' })
    ).toBeInTheDocument()
    expect(useLastVisitedSpacesMock).toHaveBeenCalled()
    expect(screen.getByText(lastVisitedSpaces[0].name)).toBeInTheDocument()
  })

  test('renders Loading when useLastVisitedSpaces is loading', () => {
    useLastVisitedSpacesMock.mockReturnValue({
      data: {},
      isLoading: true,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<LastVisitedSpaces />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })
})
