import { render, screen } from '@testing-library/react'
import draw from './_utils/draw'
import Canvas from './Canvas'

vi.mock('./_utils/draw')
const drawMock = vi.mocked(draw)

describe('Wall', () => {
  test('renders the wall with the correct direction', () => {
    const direction = 'N'
    const name = 'wall'

    render(<Canvas name={name} direction={direction} />)

    expect(
      screen.getByRole('img', { name: `Asset: ${name} - ${direction}` })
    ).toBeInTheDocument()

    expect(drawMock).toHaveBeenCalledWith(
      screen.getByRole('img', { name: `Asset: ${name} - ${direction}` }),
      name,
      direction
    )
  })
})
