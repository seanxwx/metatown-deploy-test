import { render, screen } from '@testing-library/react'
import useUser from '@/hooks/useUser'
import UserInfo from './UserInfo'

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('UserInfo', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useUser with userId', () => {
    const userId = 'USER_ID'

    useUserMock.mockReturnValue({
      data: { id: userId },
    } as ReturnType<typeof useUser>)

    render(<UserInfo userId={userId} />)

    expect(useUserMock).toHaveBeenCalledWith(userId)
  })

  test('renders nothing if user not found', () => {
    const userId = 'USER_ID'

    useUserMock.mockReturnValue({
      data: null,
    } as ReturnType<typeof useUser>)

    const { container } = render(<UserInfo userId={userId} />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders user displayName', () => {
    const userId = 'USER_ID'
    const user = { id: userId, displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    render(<UserInfo userId={userId} />)

    expect(screen.getByText(user.displayName)).toBeInTheDocument()
  })

  test('renders mic off icon', () => {
    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    render(<UserInfo userId="USER_ID" isMuted />)

    expect(screen.getByLabelText('Muted')).toBeInTheDocument()
  })
})
