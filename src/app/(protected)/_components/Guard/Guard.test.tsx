import { render, screen } from '@testing-library/react'
import useSession from '@/hooks/useSession'
import useSessionUser from '@/hooks/useSessionUser'
import Guard from './Guard'

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('Guard', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSession and useSessionUser', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<Guard>Hello world</Guard>)

    expect(useSessionMock).toHaveBeenCalled()
    expect(useSessionUserMock).toHaveBeenCalled()
  })

  test('renders loading when useSession is loading', () => {
    useSessionMock.mockReturnValue({
      data: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<Guard>Hello world</Guard>)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()
  })

  test('renders loading when useSessionUser is loading', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<Guard>Hello world</Guard>)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()
  })

  test('renders nothing when useSession returns false', () => {
    useSessionMock.mockReturnValue({
      data: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    const { container } = render(<Guard>Hello world</Guard>)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders form on top of children when user is not found', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<Guard>Hello world</Guard>)

    expect(
      screen.getByRole('button', { name: 'Create user' })
    ).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  test('renders only children when user is found', () => {
    useSessionMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSessionUserMock.mockReturnValue({
      data: {},
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    render(<Guard>Hello world</Guard>)

    expect(
      screen.queryByRole('button', { name: 'Create user' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})
