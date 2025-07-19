import { render, screen } from '@testing-library/react'
import Navigation from './Navigation'

describe('Navigation', () => {
  test('renders logo', () => {
    render(<Navigation />)

    expect(screen.getByRole('link', { name: 'Meta Town' })).toBeInTheDocument()
  })

  test('renders Events button', () => {
    render(<Navigation />)

    expect(screen.getByRole('button', { name: 'Events' })).toBeInTheDocument()
  })

  test('renders My Spaces button', () => {
    render(<Navigation />)

    expect(
      screen.getByRole('button', { name: 'My Spaces' })
    ).toBeInTheDocument()
  })
})
