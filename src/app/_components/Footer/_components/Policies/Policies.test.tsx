import { render, screen } from '@testing-library/react'
import Policies, { LINKS } from './Policies'

describe('Policies', () => {
  test.each(LINKS)('renders %s link', ({ name, href }) => {
    render(<Policies />)

    expect(screen.getByRole('link', { name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  })
})
