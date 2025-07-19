import { render, screen } from '@testing-library/react'
import SignUp from './page'

describe('SignUp', () => {
  test('renders Form', async () => {
    render(<SignUp />)

    expect(
      await screen.findByText(/By signing up, you agree to our/i)
    ).toBeInTheDocument()
  })

  test('renders link to login page', async () => {
    render(<SignUp />)

    expect(
      await screen.findByRole('link', { name: 'Login now!' })
    ).toHaveAttribute('href', '/authentication/login')
  })
})
