import { renderHook } from '@testing-library/react'
import { act } from 'react'
import useZoom, { BASE_ZOOM, ZOOM_CLAMP, ZOOM_STEP } from './useZoom'

describe('useZoom', () => {
  test('returns zoom', () => {
    const { result } = renderHook(() => useZoom())

    expect(result.current.zoom).toBe(BASE_ZOOM)
  })

  test('zooms in', () => {
    const { result } = renderHook(() => useZoom())

    act(() => {
      result.current.zoomIn()
    })

    expect(result.current.zoom).toBe(BASE_ZOOM + ZOOM_STEP)
  })

  test('zooms out', () => {
    const { result } = renderHook(() => useZoom())

    act(() => {
      result.current.zoomOut()
    })

    expect(result.current.zoom).toBe(BASE_ZOOM - ZOOM_STEP)
  })

  test('zooms to the maximum', () => {
    const { result } = renderHook(() => useZoom())

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.zoomIn()
      }
    })

    expect(result.current.zoom).toBe(BASE_ZOOM + ZOOM_CLAMP * ZOOM_STEP)
  })

  test('zooms to the minimum', () => {
    const { result } = renderHook(() => useZoom())

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.zoomOut()
      }
    })

    expect(result.current.zoom).toBe(BASE_ZOOM - ZOOM_CLAMP * ZOOM_STEP)
  })
})
