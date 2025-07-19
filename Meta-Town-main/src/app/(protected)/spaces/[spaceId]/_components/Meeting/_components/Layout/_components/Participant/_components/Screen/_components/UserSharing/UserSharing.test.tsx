import { render, screen } from '@testing-library/react'
import useUser from '@/hooks/useUser'
import UserSharing from './UserSharing'

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('UserSharing', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useUser with userId', () => {
    const userId = 'USER_ID'

    useUserMock.mockReturnValue({
      data: { id: userId },
    } as ReturnType<typeof useUser>)

    render(<UserSharing userId={userId} />)

    expect(useUser).toHaveBeenCalledWith(userId)
  })

  test('renders nothing if user not found', () => {
    const userId = 'USER_ID'

    useUserMock.mockReturnValue({
      data: null,
    } as ReturnType<typeof useUser>)

    const { container } = render(<UserSharing userId={userId} />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders user displayName', () => {
    const userId = 'USER_ID'
    const user = { id: userId, displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    render(<UserSharing userId={userId} />)

    expect(
      screen.getByText(`${user.displayName} is Sharing`)
    ).toBeInTheDocument()
  })
})
