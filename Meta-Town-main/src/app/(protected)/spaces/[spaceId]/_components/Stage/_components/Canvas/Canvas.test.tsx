import { render, screen } from '@testing-library/react'
import { RefObject } from 'react'
import Canvas from './Canvas'

describe('Canvas', () => {
  test('renders canvas', () => {
    const ref: RefObject<HTMLCanvasElement | null> = { current: null }
    const className = 'CLASS_NAME'

    render(<Canvas aria-label="Canvas" ref={ref} className={className} />)

    expect(screen.getByLabelText('Canvas')).toBeInTheDocument()
    expect(screen.getByLabelText('Canvas')).toHaveClass(className)
    expect(ref.current).toBe(screen.getByLabelText('Canvas'))
  })
})
