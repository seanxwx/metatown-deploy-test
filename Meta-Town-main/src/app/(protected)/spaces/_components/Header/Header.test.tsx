import { render, screen } from '@testing-library/react'
import useSessionUser from '@/hooks/useSessionUser'
import useSession from '@/hooks/useSession'
import Header from './Header'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

describe('Header', () => {
  test('renders Navigation', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)
    render(<Header />)

    expect(screen.getByRole('button', { name: 'Events' })).toBeInTheDocument()
  })

  test('renders Actions', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)
    render(<Header />)

    expect(
      screen.getByRole('button', {
        name: 'John Doe',
      })
    ).toBeInTheDocument()
  })
})
