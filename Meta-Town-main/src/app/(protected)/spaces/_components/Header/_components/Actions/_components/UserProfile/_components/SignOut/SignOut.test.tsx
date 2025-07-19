import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import navigate from '@/utils/navigate'
import SignOut from './SignOut'

vi.mock('@/utils/navigate')

describe('SignOut', () => {
  test('renders sign-out button', async () => {
    render(<SignOut />)

    expect(
      await screen.findByRole('button', { name: 'Sign Out' })
    ).toBeInTheDocument()
  })

  test('redirects to sign-out page when Sign Out button is clicked', async () => {
    const user = userEvent.setup()

    render(<SignOut />)

    await user.click(await screen.findByRole('button', { name: 'Sign Out' }))

    expect(navigate).toHaveBeenCalledWith('/authentication/sign-out')
  })
})
