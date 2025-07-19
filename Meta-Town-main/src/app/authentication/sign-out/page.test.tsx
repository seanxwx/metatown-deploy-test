import { render, screen, waitFor } from '@testing-library/react'
import signOut from '@/db/signOut'
import useSession from '@/hooks/useSession'
import navigate from '@/utils/navigate'
import SignOut from './page'

vi.mock('@/db/signOut')
const signOutMock = vi.mocked(signOut)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/utils/navigate')

describe('SignOutPage', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls signOut and redirects to login', async () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)
    signOutMock.mockResolvedValue()
    render(<SignOut />)

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled()
    })
    expect(navigate).toHaveBeenCalledWith('/authentication/login')
  })

  test('renders GlobalLoading', () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)
    signOutMock.mockResolvedValue()
    render(<SignOut />)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()
  })
})
