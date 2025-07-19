import { render, screen } from '@testing-library/react'
import useSession from '@/hooks/useSession'
import useSessionUser from '@/hooks/useSessionUser'
import ProtectedLayout from './layout'

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('ProtectedLayout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Guard', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<ProtectedLayout>Hello world</ProtectedLayout>)

    expect(useSession).toHaveBeenCalled()
    expect(useSessionUser).toHaveBeenCalled()
  })

  test('passes children to Guard', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<ProtectedLayout>Hello world</ProtectedLayout>)

    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})
