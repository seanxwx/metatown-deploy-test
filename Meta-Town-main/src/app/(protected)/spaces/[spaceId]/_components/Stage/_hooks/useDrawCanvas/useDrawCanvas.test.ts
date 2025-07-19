import { renderHook, waitFor } from '@testing-library/react'
import useDrawCanvas from './useDrawCanvas'

describe('useDrawCanvas', () => {
  test('draws with initialized canvas', async () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame')

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

    const onDraw = vi.fn()

    renderHook(() => useDrawCanvas(canvas, { zoom, cameraOffset }, onDraw))

    expect(window.requestAnimationFrame).toHaveBeenCalled()

    await waitFor(() => expect(canvas.getContext).toHaveBeenCalledWith('2d'))

    expect(canvas.width).toBe(parentElement.clientWidth)
    expect(canvas.height).toBe(parentElement.clientHeight)

    expect(context.clearRect).toHaveBeenCalledWith(
      0,
      0,
      canvas.width,
      canvas.height
    )

    expect(context.setTransform).toHaveBeenCalledWith(
      zoom,
      0,
      0,
      zoom,
      cameraOffset.left,
      cameraOffset.top
    )

    expect(onDraw).toHaveBeenCalledWith(context)

    expect(window.requestAnimationFrame).toHaveBeenCalled()

    requestAnimationFrameSpy.mockRestore()
  })
})
