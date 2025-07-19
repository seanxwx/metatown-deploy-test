import { render, screen } from '@testing-library/react'
import { Dimensions, Indexed, Movement, Position } from '@/app/types'
import EnteredZone from './EnteredZone'
import drawEnteredZone from './_utils/drawEnteredZone'

vi.mock('./_utils/drawEnteredZone')

describe('useDrawEnteredZone', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws entered zone on canvas', () => {
    const zones: Indexed<Position>[] = [
      {
        id: 'ZONE_ID',
        x: 1,
        y: 0,
        direction: 'N',
      },
    ]

    const movement: Movement = {
      x: 1,
      y: 0,
      direction: 'N',
      isMoving: false,
    }

    const dimensions: Dimensions = { rows: 2, columns: 2 }

    const canvasConfig = {
      zoom: 1,
      cameraOffset: { top: 0, left: 0 },
    }

    const { rerender } = render(
      <EnteredZone
        zones={zones}
        movement={movement}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    expect(screen.getByLabelText('Entered Zone Canvas')).toBeInTheDocument()

    vi.spyOn(
      screen.getByLabelText<HTMLCanvasElement>('Entered Zone Canvas'),
      'getContext'
    ).mockReturnValue({
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D)

    rerender(
      <EnteredZone
        zones={zones}
        movement={movement}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    expect(drawEnteredZone).toHaveBeenCalledWith(
      screen
        .getByLabelText<HTMLCanvasElement>('Entered Zone Canvas')
        .getContext('2d'),
      zones[0],
      dimensions,
      zones
    )
  })

  test('does not draw entered zone if zones is not present', () => {
    const movement: Movement = {
      x: 1,
      y: 0,
      direction: 'N',
      isMoving: false,
    }

    const dimensions: Dimensions = { rows: 2, columns: 2 }

    const canvasConfig = {
      zoom: 1,
      cameraOffset: { top: 0, left: 0 },
    }

    const { rerender } = render(
      <EnteredZone
        zones={null}
        movement={movement}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    vi.spyOn(
      screen.getByLabelText<HTMLCanvasElement>('Entered Zone Canvas'),
      'getContext'
    ).mockReturnValue({
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D)

    rerender(
      <EnteredZone
        zones={null}
        movement={movement}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    expect(drawEnteredZone).not.toHaveBeenCalled()
  })

  test('does not draw entered zone if is not entering a zone', () => {
    const zones: Indexed<Position>[] = [
      {
        id: 'ZONE_ID',
        x: 1,
        y: 0,
        direction: 'N',
      },
    ]

    const movement: Movement = {
      x: 0,
      y: 0,
      direction: 'N',
      isMoving: false,
    }

    const dimensions: Dimensions = { rows: 2, columns: 2 }

    const canvasConfig = {
      zoom: 1,
      cameraOffset: { top: 0, left: 0 },
    }

    const { rerender } = render(
      <EnteredZone
        zones={zones}
        movement={movement}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    vi.spyOn(
      screen.getByLabelText<HTMLCanvasElement>('Entered Zone Canvas'),
      'getContext'
    ).mockReturnValue({
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D)

    rerender(
      <EnteredZone
        zones={zones}
        movement={movement}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    expect(drawEnteredZone).not.toHaveBeenCalled()
  })

  test('does not draw entered zone if movement is not present', () => {
    const zones: Indexed<Position>[] = [
      {
        id: 'ZONE_ID',
        x: 1,
        y: 0,
        direction: 'N',
      },
    ]
    const dimensions: Dimensions = { rows: 2, columns: 2 }

    const canvasConfig = {
      zoom: 1,
      cameraOffset: { top: 0, left: 0 },
    }

    const { rerender } = render(
      <EnteredZone
        zones={zones}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    vi.spyOn(
      screen.getByLabelText<HTMLCanvasElement>('Entered Zone Canvas'),
      'getContext'
    ).mockReturnValue({
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D)

    rerender(
      <EnteredZone
        zones={zones}
        dimensions={dimensions}
        canvasConfig={canvasConfig}
      />
    )

    expect(drawEnteredZone).not.toHaveBeenCalled()
  })
})
