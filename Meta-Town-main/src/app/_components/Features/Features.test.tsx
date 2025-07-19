import { render, screen } from '@testing-library/react'
import Features, { SECTIONS } from './Features'

describe('Features', () => {
  test.each(SECTIONS)('renders Section', ({ description }) => {
    render(<Features />)

    expect(
      screen.getByRole('heading', { level: 3, name: description.heading })
    ).toBeInTheDocument()
  })
})
