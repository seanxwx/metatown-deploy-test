import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VARIANT } from '@/components/Button'
import upsertUser from '@/db/upsertUser'
import useSession from '@/hooks/useSession'
import useSessionUser from '@/hooks/useSessionUser'
import UserProfile from './UserProfile'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/db/upsertUser')
const upsertUserMock = vi.mocked(upsertUser)

describe('UserProfile', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders user profile button', () => {
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

    render(<UserProfile />)

    expect(screen.getByRole('button', { name: 'John Doe' })).toBeInTheDocument()
  })

  test('renders dropdown menu when user profile button is clicked', async () => {
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

    const user = userEvent.setup()

    render(<UserProfile />)

    expect(screen.getByRole('button', { name: 'John Doe' })).toHaveClass(
      VARIANT.light
    )

    await user.click(screen.getByRole('button', { name: 'John Doe' }))

    expect(screen.getByRole('button', { name: 'John Doe' })).toHaveClass(
      VARIANT.secondary
    )

    expect(
      within(screen.getByRole('menu')).getByRole('button', {
        name: 'Edit Profile',
      })
    ).toBeInTheDocument()

    expect(
      await within(screen.getByRole('menu')).findByRole('button', {
        name: 'Sign Out',
      })
    ).toBeInTheDocument()
  })

  test('does not render edit profile modal initially', async () => {
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

    const user = userEvent.setup()

    render(<UserProfile />)

    await user.click(screen.getByRole('button', { name: 'John Doe' }))

    expect(
      screen.queryByRole('heading', { name: 'Edit Your Profile' })
    ).not.toBeInTheDocument()
  })

  test('opens edit profile modal when button is clicked', async () => {
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

    const user = userEvent.setup()

    render(<UserProfile />)

    await user.click(screen.getByRole('button', { name: 'John Doe' }))
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }))

    expect(
      screen.getByRole('heading', { name: 'Edit Your Profile' })
    ).toBeInTheDocument()
  })

  test('closes edit profile modal when close button is clicked', async () => {
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

    const user = userEvent.setup()

    render(<UserProfile />)

    await user.click(screen.getByRole('button', { name: 'John Doe' }))
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(
      screen.queryByRole('heading', { name: 'Edit Your Profile' })
    ).not.toBeInTheDocument()
  })

  test('renders user display name', () => {
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

    render(<UserProfile />)

    expect(screen.getByRole('button', { name: 'John Doe' })).toBeInTheDocument()
  })

  test('renders session user email when user is null', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    render(<UserProfile />)

    expect(
      screen.getByRole('button', { name: 'test@example.com' })
    ).toBeInTheDocument()
  })

  test('renders nothing when session is null', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    const { container } = render(<UserProfile />)

    expect(container).toBeEmptyDOMElement()
  })

  test('closes edit profile modal after submission', async () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    upsertUserMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    const user = userEvent.setup()

    render(<UserProfile />)

    await user.click(screen.getByRole('button', { name: 'John Doe' }))
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }))
    await user.click(screen.getByRole('button', { name: 'FEMALE_01' }))

    expect(
      screen.queryByRole('textbox', { name: 'Your profile name' })
    ).not.toBeInTheDocument()
  })

  test('renders user avatar', () => {
    const avatar = 'FEMALE_01'

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar,
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    render(<UserProfile />)

    expect(screen.getByRole('img', { name: avatar })).toBeInTheDocument()
  })

  test('does not render user avatar if no user info', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'ID', email: 'test@example.com' },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    render(<UserProfile />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
