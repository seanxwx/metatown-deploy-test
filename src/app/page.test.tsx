import { render, screen } from '@testing-library/react'
import useSession from '@/hooks/useSession'
import App from './page'

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

describe('App', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Header', async () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      await screen.findByRole('button', { name: 'Options' })
    ).toBeInTheDocument()
  })

  test('renders Banner', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      screen.getByText(
        "Australia's Original Online Interactive Learning Platform"
      )
    ).toBeInTheDocument()
  })

  test('renders Features', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Immersive Classroom' })
    ).toBeInTheDocument()
  })

  test('renders AboutTheTeam', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      screen.getByText('Make Remote Collaboration More Efficient And Fun')
    ).toBeInTheDocument()
  })

  test('renders Functions', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      screen.getByText('Everything You Need To Telecommuter in Meta Town')
    ).toBeInTheDocument()
  })

  test('renders CTABanner', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      screen.getByText(
        'Create A Let You of The Virtual Classroom Learning Team Full of Vitality'
      )
    ).toBeInTheDocument()
  })

  test('renders Footer', () => {
    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    render(<App />)

    expect(
      screen.getByText('© 2025 Meta Town Presence Inc.')
    ).toBeInTheDocument()
  })
})
