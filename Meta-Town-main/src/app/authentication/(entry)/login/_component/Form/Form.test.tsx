import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import login from '@/db/login'
import useSession from '@/hooks/useSession'
import navigate from '@/utils/navigate'
import Form, { getServerErrorMessage } from './Form'

vi.mock('@/db/login')
const loginMock = vi.mocked(login)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

vi.mock('@/utils/navigate')

describe('Form', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders form', () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)

    render(<Form />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  test('calls useSession with skipCheck', () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)

    render(<Form />)

    expect(useSessionMock).toHaveBeenCalledWith(true)
  })

  test('authenticates user on form submit', async () => {
    const mutate = vi.fn()

    useSessionMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useSession>)

    loginMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000, { error: null }))
    )

    const user = userEvent.setup()

    render(<Form />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled()

    expect(login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })

    await waitFor(() => expect(mutate).toHaveBeenCalledWith())

    expect(navigate).toHaveBeenCalledWith('/spaces')

    expect(screen.getByRole('button', { name: 'Login' })).not.toBeDisabled()
  })

  test('shows validation errors message when form is submitted with empty fields', async () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)

    const user = userEvent.setup()
    render(<Form />)

    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(
      screen.getByText('Please enter your email address')
    ).toBeInTheDocument()

    expect(screen.getByText('Please enter a password')).toBeInTheDocument()
  })

  test('render server error message when login fails', async () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)

    loginMock.mockResolvedValue({
      error: { code: 'invalid_credentials' },
    } as unknown as Awaited<ReturnType<typeof login>>)

    const user = userEvent.setup()
    render(<Form />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(
      screen.getByText('Incorrect email or password. Please try again.')
    ).toBeInTheDocument()
  })

  test('renders bypassed server error message when it is not related to credentials', async () => {
    useSessionMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)

    loginMock.mockResolvedValue({
      error: { code: 'manual_linking_disabled' },
    } as unknown as Awaited<ReturnType<typeof login>>)

    const user = userEvent.setup()
    render(<Form />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(
      screen.getByText('Something wrong, please try again later.')
    ).toBeInTheDocument()
  })
})

describe('getServerErrorMessage', () => {
  test('returns undefined if there is no errors', () => {
    expect(getServerErrorMessage(undefined)).toBeUndefined()
    expect(getServerErrorMessage(null)).toBeUndefined()
  })
})
