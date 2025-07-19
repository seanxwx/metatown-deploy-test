import { fireEvent, renderHook } from '@testing-library/react'
import { CameraOffset, ConfigItem } from '@/app/types'
import useConfigPosition from './useConfigPosition'

describe('useConfigPosition', () => {
  test('returns config position with config item blocks direction E on moving mouse inside canvas', () => {
    const configItem: ConfigItem = {
      type: 'blocks',
      element: 'wall',
      direction: 'E',
    }
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        configItem,
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
          entry: { x: 0, y: 0, direction: 'N' },
          grounds: [{ x: 1, y: 0, direction: 'N', texture: 'grass' }],
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      ...configItem,
      x: 2,
      y: 2,
    })

    fireEvent.mouseLeave(canvas)

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns config position with config item entry direction W on moving mouse inside canvas', () => {
    const configItem: ConfigItem = { type: 'entry' }
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        configItem,
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
          entry: { x: 0, y: 0, direction: 'N' },
          grounds: [{ x: 1, y: 0, direction: 'N', texture: 'grass' }],
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      ...configItem,
      direction: 'N',
      x: 2,
      y: 2,
    })

    fireEvent.mouseLeave(canvas)

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns config position with config item grounds direction N on moving mouse inside canvas', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'grounds', texture: 'grass' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          blocks: [{ x: 1, y: 1, element: 'wall', direction: 'N' }],
          entry: { x: 0, y: 0, direction: 'N' },
          grounds: [{ x: 1, y: 0, direction: 'N', texture: 'grass' }],
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      type: 'grounds',
      texture: 'grass',
      direction: 'N',
      x: 2,
      y: 2,
    })

    fireEvent.mouseLeave(canvas)

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns null with config item blocks on moving mouse inside canvas but blocked', () => {
    const configItem: ConfigItem = {
      type: 'blocks',
      element: 'wall',
      direction: 'E',
    }
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        configItem,
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      ...configItem,
      direction: 'E',
      x: 2,
      y: 2,
    })

    fireEvent.mouseMove(canvas, {
      clientX: 0,
      clientY: 0,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns null with config item entry on moving mouse inside canvas but blocked', () => {
    const configItem: ConfigItem = { type: 'entry' }
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        configItem,
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      ...configItem,
      direction: 'N',
      x: 2,
      y: 2,
    })

    fireEvent.mouseMove(canvas, {
      clientX: 0,
      clientY: 0,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns null with config item grounds on moving mouse inside canvas but blocked', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'grounds', texture: 'grass' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          entry: { x: 0, y: 0, direction: 'N' },

          blocks: [{ x: 0, y: 0, direction: 'N', element: 'wall' }],
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      type: 'grounds',
      direction: 'N',
      texture: 'grass',
      x: 2,
      y: 2,
    })

    fireEvent.mouseMove(canvas, {
      clientX: 0,
      clientY: 0,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns nothing when config item blocks outside map', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'blocks', element: 'wall', direction: 'N' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 300,
      clientY: 300,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns nothing when config item entry outside map', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'entry' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 300,
      clientY: 300,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns nothing when config item grounds outside map', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'grounds', texture: 'grass' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 300,
      clientY: 300,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns block position with config item delete on moving over a block', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'delete' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 50,
      clientY: 50,
    })

    expect(result.current).toEqual({
      type: 'delete',
      direction: 'N',
      x: 1,
      y: 1,
    })

    fireEvent.mouseLeave(canvas)

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns null with config item delete on moving over but not a block', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result } = renderHook(() =>
      useConfigPosition(
        canvas,
        { type: 'delete' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    fireEvent.mouseMove(canvas, {
      clientX: 50,
      clientY: 50,
    })

    expect(result.current).toEqual({
      type: 'delete',
      direction: 'N',
      x: 1,
      y: 1,
    })

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('returns null on changing config item to null', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result, rerender } = renderHook(
      ({ configItem }: { configItem: ConfigItem | null }) =>
        useConfigPosition(
          canvas,
          configItem,
          { rows: 5, columns: 5 },
          { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
          {
            blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
            entry: { x: 0, y: 0, direction: 'N' },
          }
        ),
      {
        initialProps: {
          configItem: { type: 'delete' },
        },
      }
    )

    fireEvent.mouseMove(canvas, {
      clientX: 50,
      clientY: 50,
    })

    expect(result.current).toEqual({
      type: 'delete',
      direction: 'N',
      x: 1,
      y: 1,
    })

    rerender({ configItem: null })

    expect(result.current).toEqual(null)

    canvas.remove()
  })

  test('does not listen to mouse events if canvas is null', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    renderHook(() =>
      useConfigPosition(
        null,
        { type: 'blocks', element: 'wall', direction: 'N' },
        { rows: 5, columns: 5 },
        { cameraOffset: { top: 0, left: 0 }, zoom: 1 },
        {
          blocks: [],
          entry: { x: 0, y: 0, direction: 'N' },
        }
      )
    )

    expect(addEventListenerSpy).not.toHaveBeenCalled()

    addEventListenerSpy.mockRestore()
  })

  test('computes different config positions based on zoom level', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result, rerender } = renderHook(
      ({ zoom }: { zoom: number }) =>
        useConfigPosition(
          canvas,
          { type: 'blocks', element: 'wall', direction: 'N' },
          { rows: 5, columns: 5 },
          { cameraOffset: { top: 0, left: 0 }, zoom },
          {
            blocks: [],
            entry: { x: 0, y: 0, direction: 'N' },
          }
        ),
      {
        initialProps: {
          zoom: 1,
        },
      }
    )

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      type: 'blocks',
      element: 'wall',
      direction: 'N',
      x: 2,
      y: 2,
    })

    rerender({ zoom: 2 })

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
    })

    expect(result.current).toEqual({
      type: 'blocks',
      element: 'wall',
      direction: 'N',
      x: 1,
      y: 1,
    })
  })

  test('computes different config positions based on camera offset', () => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
    } as DOMRect)

    const { result, rerender } = renderHook(
      ({ cameraOffset }: { cameraOffset: CameraOffset }) =>
        useConfigPosition(
          canvas,
          { type: 'blocks', element: 'wall', direction: 'N' },
          { rows: 5, columns: 5 },
          { cameraOffset, zoom: 1 },
          {
            blocks: [],
            entry: { x: 0, y: 0, direction: 'N' },
          }
        ),
      {
        initialProps: {
          cameraOffset: { top: 0, left: 0 },
        },
      }
    )

    fireEvent.mouseMove(canvas, {
      clientX: 96,
      clientY: 96,
    })

    expect(result.current).toEqual({
      type: 'blocks',
      element: 'wall',
      direction: 'N',
      x: 2,
      y: 2,
    })

    rerender({ cameraOffset: { top: 48, left: 48 } })

    fireEvent.mouseMove(canvas, {
      clientX: 96,
      clientY: 96,
    })

    expect(result.current).toEqual({
      type: 'blocks',
      element: 'wall',
      direction: 'N',
      x: 1,
      y: 1,
    })
  })
})
