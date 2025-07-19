import { render, screen, waitFor } from '@testing-library/react'
import { useParams } from 'next/navigation'
import joinSpace from '@/db/joinSpace'
import useJoinedSpaces from '@/hooks/useJoinedSpaces'
import useSessionUser from '@/hooks/useSessionUser'
import navigate from '@/utils/navigate'
import Join from './page'

vi.mock('next/navigation')
const userParamsMock = vi.mocked(useParams)

vi.mock('@/utils/navigate')

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useJoinedSpaces')
const useJoinedSpacesMock = vi.mocked(useJoinedSpaces)

vi.mock('@/db/joinSpace')

describe('Join', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders GlobalLoading', () => {
    userParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useJoinedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    render(<Join />)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()
  })

  test('does not call joinSpace if there is no user', () => {
    userParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

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

    render(<Join />)

    expect(joinSpace).not.toBeCalled()
  })

  test('does not call joinSpace if it is still loading joinSpaces', () => {
    userParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useJoinedSpacesMock.mockReturnValue({
      data: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    render(<Join />)

    expect(joinSpace).not.toBeCalled()
  })

  test('redirect to space if user has joined the space', () => {
    userParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

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

    render(<Join />)

    expect(joinSpace).not.toBeCalled()

    expect(navigate).toHaveBeenCalledWith('/spaces/SPACE_ID')
  })

  test('adds user to space and redirect to space if user has not joined the space', async () => {
    userParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useJoinedSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID_2',
          name: 'Space Name',
          lastSeenAt: '2021-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useJoinedSpaces>)

    render(<Join />)

    await waitFor(() =>
      expect(joinSpace).toBeCalledWith({
        spaceId: 'SPACE_ID',
        userId: 'ID',
      })
    )

    expect(navigate).toHaveBeenCalledWith('/spaces/SPACE_ID')
  })
})
