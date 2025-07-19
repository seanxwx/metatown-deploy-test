import { Position } from '@/app/types'
import drawLucideIcon from '../drawLucideIcon'
import drawEntry from './drawEntry'

vi.mock('../drawLucideIcon')

describe('drawEntry', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws lucide icon with entry position', () => {
    const context = {} as CanvasRenderingContext2D

    const entry: Position = { x: 10, y: 20, direction: 'E' }

    drawEntry(context, entry)

    expect(drawLucideIcon).toHaveBeenCalledWith(context, 'door-open', entry)
  })
})
