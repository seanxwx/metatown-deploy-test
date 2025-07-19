import { render, screen } from '@testing-library/react'
import Navigation, { LINKS } from './Navigation'

describe('Navigation', () => {
  test.each(LINKS)('renders %s link', ({ name, href }) => {
    render(<Navigation />)

    expect(screen.getByRole('link', { name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  })
})
