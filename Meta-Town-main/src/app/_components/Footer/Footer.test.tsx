import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  test('renders Logo', () => {
    render(<Footer />)

    expect(
      screen.getByRole('img', { name: 'Meta Town (light)' })
    ).toBeInTheDocument()
  })

  test('renders Navigation', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  test('renders Social', async () => {
    render(<Footer />)

    expect(
      await screen.findByRole('button', { name: 'linkedin' })
    ).toBeInTheDocument()
  })

  test('renders Policies', () => {
    render(<Footer />)

    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toBeInTheDocument()
  })

  test('renders copyright', () => {
    render(<Footer />)

    expect(
      screen.getByText('© 2025 Meta Town Presence Inc.')
    ).toBeInTheDocument()
  })
})
