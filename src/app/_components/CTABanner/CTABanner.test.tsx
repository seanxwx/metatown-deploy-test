import { render, screen } from '@testing-library/react'
import CTABanner from './CTABanner'

describe('CTABanner', () => {
  test('renders CTABanner', () => {
    render(<CTABanner />)

    expect(
      screen.getByText(
        'Create A Let You of The Virtual Classroom Learning Team Full of Vitality'
      )
    ).toBeInTheDocument()
  })
})
