import { render, screen } from '@testing-library/react'
import useSession from '@/hooks/useSession'
import Header from './Header'

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

describe('Header', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Logo', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Meta Town' })).toBeInTheDocument()
  })

  test('renders Navigation', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<Header />)

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  test('renders Actions', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<Header />)

    expect(screen.getByText('Get started')).toBeInTheDocument()
  })

  test('renders Options button', async () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<Header />)

    expect(
      await screen.findByRole('button', { name: 'Options' })
    ).toBeInTheDocument()
  })
})
