import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useSessionUser from '@/hooks/useSessionUser'
import useSession from '@/hooks/useSession'
import { VARIANT } from '@/components/Button'
import Actions from './Actions'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

describe('Actions', () => {
  test('renders users button', () => {
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

    render(<Actions />)

    expect(screen.getByRole('button', { name: 'John Doe' })).toBeInTheDocument()
  })

  test('renders Resources button', () => {
    render(<Actions />)

    expect(
      screen.getByRole('button', { name: 'Resources' })
    ).toBeInTheDocument()
  })

  test('renders i18n button', () => {
    render(<Actions />)

    expect(
      screen.getByRole('button', { name: 'Select a language' })
    ).toBeInTheDocument()
  })

  test('opens language dropdown when trigger is clicked', async () => {
    const user = userEvent.setup()

    render(<Actions />)

    await user.click(screen.getByRole('button', { name: 'Select a language' }))

    expect(
      within(screen.getByRole('menu')).getByRole('button', { name: 'English' })
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('menu')).getByRole('button', {
        name: 'Chinese',
      })
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('menu')).getByRole('button', { name: '日本語' })
    ).toBeInTheDocument()
  })

  test('renders Create Spaces button', () => {
    render(<Actions />)

    expect(
      screen.getByRole('button', { name: 'Create Spaces' })
    ).toBeInTheDocument()
  })

  test('toggles the language button variant between "naked" and "light" on open and close', async () => {
    useSessionUserMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSessionUser>
    )

    useSessionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSession>
    )

    const user = userEvent.setup()

    render(<Actions />)

    expect(
      screen.getByRole('button', { name: 'Select a language' })
    ).toHaveClass(VARIANT.naked)

    await user.click(screen.getByRole('button', { name: 'Select a language' }))

    expect(
      screen.getByRole('button', { name: 'Select a language' })
    ).toHaveClass(VARIANT.light)

    await user.click(screen.getByRole('button', { name: 'Select a language' }))

    expect(
      screen.getByRole('button', { name: 'Select a language' })
    ).toHaveClass(VARIANT.naked)
  })
})
