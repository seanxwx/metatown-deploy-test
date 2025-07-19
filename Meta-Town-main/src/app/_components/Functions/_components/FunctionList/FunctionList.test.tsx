import { render, screen } from '@testing-library/react'
import FunctionList, { FUNCTIONS } from './FunctionList'

describe('FunctionList', () => {
  test.each(FUNCTIONS)('renders %s function', ({ title }) => {
    render(<FunctionList />)

    expect(screen.getByText(title)).toBeInTheDocument()
  })
})
