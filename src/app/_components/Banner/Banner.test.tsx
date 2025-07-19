import { render, screen } from '@testing-library/react'
import Banner from './Banner'

describe('Banner', () => {
  test('renders content', () => {
    render(<Banner />)

    expect(
      screen.getByText(
        "Australia's Original Online Interactive Learning Platform"
      )
    ).toBeInTheDocument()
  })
})
