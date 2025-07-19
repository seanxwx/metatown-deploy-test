import { render, screen } from '@testing-library/react'
import Conditions from './Conditions'

describe('Conditions', () => {
  test('renders agreement', () => {
    render(<Conditions />)

    expect(
      screen.getByText(/By signing up, you agree to our:/i)
    ).toBeInTheDocument()
  })

  test('renders terms and conditions', () => {
    render(<Conditions />)

    expect(
      screen.getByRole('link', { name: 'Terms & Conditions' })
    ).toHaveAttribute('href', '/')
  })

  test('renders privacy police', () => {
    render(<Conditions />)

    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', '/')
  })
})
