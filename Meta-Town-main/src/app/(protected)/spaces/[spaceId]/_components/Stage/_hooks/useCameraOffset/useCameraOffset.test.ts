import { renderHook } from '@testing-library/react'
import { Dimensions, Position } from '@/app/types'
import getCameraOffset from './_utils/getCameraOffset'
import useCameraOffset from './useCameraOffset'

vi.mock('./_utils/getCameraOffset')
const getCameraOffsetMock = vi.mocked(getCameraOffset)

describe('useCameraOffset', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns camera offset', () => {
    const cameraOffset = { left: -100, top: -200 }

    getCameraOffsetMock.mockReturnValue(cameraOffset)

    const ref = { current: document.createElement('canvas') }

    const zoom = 1
    const dimensions: Dimensions = { rows: 10, columns: 10 }
    const userPosition: Position = { x: 3, y: 3, direction: 'N' }

    const { result } = renderHook(() =>
      useCameraOffset(ref, { zoom, dimensions, userPosition })
    )

    expect(getCameraOffset).toHaveBeenCalledWith(ref.current, {
      zoom,
      dimensions,
      userPosition,
    })

    expect(result.current).toEqual(cameraOffset)
  })

  test('observes ref for size changes', () => {
    const resizeObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    const ResizeObserver = vi.fn().mockReturnValue(resizeObserver)

    vi.stubGlobal('ResizeObserver', ResizeObserver)

    const ref = { current: document.createElement('canvas') }

    const { unmount } = renderHook(() =>
      useCameraOffset(ref, {
        zoom: 1,
        dimensions: { rows: 10, columns: 10 },
        userPosition: { x: 3, y: 3, direction: 'N' },
      })
    )

    expect(ResizeObserver).toHaveBeenCalledWith(expect.any(Function))
    expect(resizeObserver.observe).toHaveBeenCalledWith(ref.current)

    unmount()

    expect(resizeObserver.disconnect).toHaveBeenCalled()
  })

  test('does not observe if ref is null', () => {
    const ResizeObserver = vi.fn()

    vi.stubGlobal('ResizeObserver', ResizeObserver)

    const ref = { current: null }

    renderHook(() =>
      useCameraOffset(ref, {
        zoom: 1,
        dimensions: { rows: 10, columns: 10 },
        userPosition: { x: 3, y: 3, direction: 'N' },
      })
    )

    expect(ResizeObserver).not.toHaveBeenCalled()
  })
})
