import { renderHook, waitFor } from '@testing-library/react'
import {
  Block,
  ConfigPosition,
  Dimensions,
  Ground,
  Indexed,
  Position,
} from '@/app/types'
import drawConfiguration from './_utils/drawConfiguration'
import drawEntry from './_utils/drawEntry'
import drawGrounds from './_utils/drawGrounds'
import drawTiledMap from './_utils/drawTiledMap'
import drawWalls from './_utils/drawWalls'
import drawZones from './_utils/drawZones'
import useDrawMainCanvas from './useDrawMainCanvas'

vi.mock('./_utils/drawEntry')
vi.mock('./_utils/drawTiledMap')
vi.mock('./_utils/drawWalls')
vi.mock('./_utils/drawGrounds')
vi.mock('./_utils/drawZones')
vi.mock('./_utils/drawConfiguration')

describe('useDrawMainCanvas', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws canvas when is not configuring', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    const zoom = 1
    const cameraOffset = { top: 0, left: 0 }
    const dimensions: Dimensions = { rows: 10, columns: 10 }
    const walls: Block[] = [{ x: 1, y: 1, direction: 'N', element: 'wall' }]
    const entry: Position = { x: 2, y: 2, direction: 'E' }
    const grounds: Ground[] = [{ x: 2, y: 3, direction: 'E', texture: 'grass' }]

    const zones: Indexed<Position>[] = [
      { id: 'zone1', x: 3, y: 3, direction: 'N' },
      { id: 'zone2', x: 4, y: 4, direction: 'S' },
    ]

    const configPosition = null

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom,
          cameraOffset,
        },
        {
          isConfiguring: false,
          zones,
          dimensions,
          walls,
          entry,
          grounds,
          configPosition,
        }
      )
    )

    expect(drawTiledMap).toHaveBeenCalledWith(context, dimensions)

    expect(drawWalls).toHaveBeenCalledWith(context, walls, configPosition)

    expect(drawEntry).toHaveBeenCalledWith(context, entry)

    expect(drawGrounds).toHaveBeenCalledWith(context, grounds, configPosition)

    expect(drawZones).not.toHaveBeenCalled()
  })

  test('draws canvas when is configuring', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    const zoom = 1
    const cameraOffset = { top: 0, left: 0 }
    const dimensions: Dimensions = { rows: 10, columns: 10 }
    const walls: Block[] = [{ x: 1, y: 1, direction: 'N', element: 'wall' }]
    const entry: Position = { x: 2, y: 2, direction: 'E' }
    const grounds: Ground[] = [{ x: 2, y: 3, direction: 'E', texture: 'grass' }]

    const zones: Indexed<Position>[] = [
      { id: 'zone1', x: 3, y: 3, direction: 'N' },
      { id: 'zone2', x: 4, y: 4, direction: 'S' },
    ]

    const configPosition = null

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom,
          cameraOffset,
        },
        {
          isConfiguring: true,
          zones,
          dimensions,
          walls,
          entry,
          grounds,
          configPosition,
        }
      )
    )

    expect(drawZones).toHaveBeenCalledWith(context, zones, configPosition)
  })

  test('does not draw anything if canvas is null', () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame')

    renderHook(() =>
      useDrawMainCanvas(
        null,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: false,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          zones: [],
          grounds: [],
        }
      )
    )

    expect(drawTiledMap).not.toHaveBeenCalled()
    expect(drawWalls).not.toHaveBeenCalled()
    expect(drawEntry).not.toHaveBeenCalled()
    expect(drawGrounds).not.toHaveBeenCalled()

    expect(window.requestAnimationFrame).not.toHaveBeenCalled()

    requestAnimationFrameSpy.mockRestore()
  })

  test('does not draw anything if canvas parentElement is null', () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame')

    const canvas = document.createElement('canvas')

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: false,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          zones: [],
          grounds: [],
        }
      )
    )

    expect(drawTiledMap).not.toHaveBeenCalled()
    expect(drawWalls).not.toHaveBeenCalled()
    expect(drawEntry).not.toHaveBeenCalled()
    expect(drawGrounds).not.toHaveBeenCalled()

    expect(window.requestAnimationFrame).not.toHaveBeenCalled()

    requestAnimationFrameSpy.mockRestore()
  })

  test('does not draw anything if context is null', () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame')

    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    parentElement.appendChild(canvas)

    vi.spyOn(canvas, 'getContext').mockReturnValue(null)

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: false,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          zones: [],
          grounds: [],
        }
      )
    )

    expect(drawTiledMap).not.toHaveBeenCalled()
    expect(drawWalls).not.toHaveBeenCalled()
    expect(drawEntry).not.toHaveBeenCalled()
    expect(drawGrounds).not.toHaveBeenCalled()

    expect(window.requestAnimationFrame).not.toHaveBeenCalled()

    requestAnimationFrameSpy.mockRestore()
  })

  test('cancels animation frame on unmount', async () => {
    const frame = 0

    const requestAnimationFrameSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockReturnValue(frame)

    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    const { unmount } = renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: false,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          zones: [],
          grounds: [],
        }
      )
    )

    await waitFor(() => expect(window.requestAnimationFrame).toHaveBeenCalled())

    unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(frame)

    requestAnimationFrameSpy.mockRestore()
    cancelAnimationFrameSpy.mockRestore()
  })

  test('does not draw grounds if grounds are undefined', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: false,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          zones: [],
          grounds: null,
        }
      )
    )

    expect(drawGrounds).not.toHaveBeenCalled()
  })

  test('does not draw walls if walls are not provided', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: false,
          dimensions: { rows: 10, columns: 10 },
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          walls: null,
          zones: [],
          grounds: [],
        }
      )
    )
    expect(drawWalls).not.toHaveBeenCalled()
  })

  test('does not draw zones when zones is not provided', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: true,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition: null,
          zones: null,
          grounds: [],
        }
      )
    )

    expect(drawZones).not.toHaveBeenCalled()
  })

  test('draws configuration when is configuring', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    const configPosition: ConfigPosition = {
      type: 'zone',
      id: 'ZONE_ID',
      x: 0,
      y: 0,
      direction: 'N',
    }

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          isConfiguring: true,
          dimensions: { rows: 10, columns: 10 },
          walls: [],
          entry: { x: 0, y: 0, direction: 'N' },
          configPosition,
          zones: [],
          grounds: [],
        }
      )
    )

    expect(drawConfiguration).toHaveBeenCalledWith(context, configPosition)
  })
})
