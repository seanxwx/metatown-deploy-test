import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import navigate from '@/utils/navigate'
import { VARIANT } from '@/components/Button'
import Resources, { LINKS } from './Resources'

vi.mock('@/utils/navigate')

describe('Resources', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('toggles dropdown on Resources button click', async () => {
    const user = userEvent.setup()

    render(<Resources />)

    expect(screen.queryByText('Help Center')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Resources' }))

    expect(
      screen.getByRole('button', { name: 'Help Center' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Resources' }))

    expect(screen.queryByText('Help Center')).not.toBeInTheDocument()
  })

  test.each(LINKS)(
    'redirects to $name page when $name button is clicked',
    async ({ name, href }) => {
      const user = userEvent.setup()

      render(<Resources />)

      await user.click(screen.getByRole('button', { name: 'Resources' }))

      await user.click(screen.getByRole('button', { name }))
      expect(navigate).toHaveBeenCalledWith(href)
    }
  )

  test('toggles the Resources trigger button variant between "naked" and "light" on open and close', async () => {
    const user = userEvent.setup()

    render(<Resources />)

    expect(screen.getByRole('button', { name: 'Resources' })).toHaveClass(
      VARIANT.naked
    )

    await user.click(screen.getByRole('button', { name: 'Resources' }))

    expect(screen.getByRole('button', { name: 'Resources' })).toHaveClass(
      VARIANT.light
    )

    await user.click(screen.getByRole('button', { name: 'Resources' }))

    expect(screen.getByRole('button', { name: 'Resources' })).toHaveClass(
      VARIANT.naked
    )
  })
})
