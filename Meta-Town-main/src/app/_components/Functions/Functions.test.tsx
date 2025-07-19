import { render, screen } from '@testing-library/react'
import Functions from './Functions'

describe('Functions', () => {
  test('renders FunctionList', () => {
    render(<Functions />)

    expect(screen.getByText('Registration & Login')).toBeInTheDocument()
  })
})
