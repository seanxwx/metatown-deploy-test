import { render, screen } from '@testing-library/react'
import Preview from './Preview'

describe('Preview', () => {
  test('renders Preview', () => {
    render(<Preview spaceId="Space ID" />)
    expect(screen.getByText('Placeholder')).toBeInTheDocument()
  })
})
