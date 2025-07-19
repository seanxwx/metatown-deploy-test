import { render, screen } from '@testing-library/react'
import Login from './page'

describe('Login', () => {
  test('renders Form', async () => {
    render(<Login />)

    expect(
      await screen.findByRole('button', { name: 'Login' })
    ).toBeInTheDocument()
  })

  test('renders link to registration page', async () => {
    render(<Login />)

    expect(
      await screen.findByRole('link', { name: 'Sign up now!' })
    ).toHaveAttribute('href', '/authentication/sign-up')
  })
})
