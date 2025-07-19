import { render, screen } from '@testing-library/react'
import CompactProse from './CompactProse'

describe('CompactProse', () => {
  test('renders children', () => {
    render(
      <CompactProse>
        <div>Hello World</div>
      </CompactProse>
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
