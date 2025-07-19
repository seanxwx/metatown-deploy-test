import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import navigate from '@/utils/navigate'
import useSession from '@/hooks/useSession'
import Actions from './Actions'

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/utils/navigate')

describe('Actions', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSession', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    render(<Actions />)

    expect(useSessionMock).toHaveBeenCalled()
  })

  test('navigates to the sign up page when clicking get started button and useSession returns false', async () => {
    useSessionMock.mockReturnValue({
      data: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    const user = userEvent.setup()

    render(<Actions />)

    expect(
      screen.getByRole('button', { name: 'Get started' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Get started' }))

    expect(navigate).toHaveBeenCalledWith('/authentication/sign-up')
  })

  test('navigates to the login page when clicking sign in button and useSession returns false', async () => {
    useSessionMock.mockReturnValue({
      data: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    const user = userEvent.setup()

    render(<Actions />)

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(navigate).toHaveBeenCalledWith('/authentication/login')
  })

  test('navigates to the spaces page when clicking go to spaces button and user is signed in', async () => {
    useSessionMock.mockReturnValue({
      data: { user: 'USER' },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    const user = userEvent.setup()

    render(<Actions />)

    expect(
      screen.getByRole('button', { name: 'Go To Spaces' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go To Spaces' }))

    expect(navigate).toHaveBeenCalledWith('/spaces')
  })
})
