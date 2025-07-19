import { renderHook } from '@testing-library/react'
import calculateGridLayout from './_utils/calculateGridLayout'
import calculateSingleAxisLayout from './_utils/calculateSingleAxisLayout'
import useLayout from './useLayout'

vi.mock('./_utils/calculateGridLayout')
const calculateGridLayoutMock = vi.mocked(calculateGridLayout)

vi.mock('./_utils/calculateSingleAxisLayout')
const calculateSingleAxisLayoutMock = vi.mocked(calculateSingleAxisLayout)

describe('useLayout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('sets style and layout for single column', () => {
    const count = 10

    const width = 400
    const height = 800

    const div = document.createElement('div')
    vi.spyOn(div, 'clientWidth', 'get').mockReturnValue(width)
    vi.spyOn(div, 'clientHeight', 'get').mockReturnValue(height)
    vi.spyOn(div, 'parentElement', 'get').mockReturnValue(document.body)

    const layout = {
      columns: 2,
      rows: 1,
      style: {
        gridTemplateColumns: 'repeat(2, 300px)',
        gridTemplateRows: 'repeat(1, 200px)',
        gap: '32px',
      },
    }

    const singleAxis = 'column'

    calculateSingleAxisLayoutMock.mockReturnValue(layout)

    const ref = { current: div }
    const { result } = renderHook(() => useLayout(ref, count, singleAxis))

    expect(result.current).toEqual({
      columns: 2,
      rows: 1,
    })

    expect(calculateSingleAxisLayout).toBeCalledWith(
      width,
      height,
      count,
      singleAxis
    )

    expect(div).toHaveStyle(layout.style)
  })

  test('sets style and layout for single row', () => {
    const count = 10

    const width = 400
    const height = 800

    const div = document.createElement('div')
    vi.spyOn(div, 'clientWidth', 'get').mockReturnValue(width)
    vi.spyOn(div, 'clientHeight', 'get').mockReturnValue(height)
    vi.spyOn(div, 'parentElement', 'get').mockReturnValue(document.body)

    const layout = {
      columns: 1,
      rows: 3,
      style: {
        gridTemplateColumns: 'repeat(1, 300px)',
        gridTemplateRows: 'repeat(3, 200px)',
        gap: '32px',
      },
    }

    const singleAxis = 'row'

    calculateSingleAxisLayoutMock.mockReturnValue(layout)

    const ref = { current: div }
    const { result } = renderHook(() => useLayout(ref, count, singleAxis))

    expect(result.current).toEqual({
      columns: 1,
      rows: 3,
    })

    expect(calculateSingleAxisLayout).toBeCalledWith(
      width,
      height,
      count,
      singleAxis
    )

    expect(div).toHaveStyle(layout.style)
  })

  test('sets style and layout for grid', () => {
    const count = 10

    const width = 800
    const height = 600

    const div = document.createElement('div')
    vi.spyOn(div, 'clientWidth', 'get').mockReturnValue(width)
    vi.spyOn(div, 'clientHeight', 'get').mockReturnValue(height)
    vi.spyOn(div, 'parentElement', 'get').mockReturnValue(document.body)

    const layout = {
      columns: 3,
      rows: 4,
      style: {
        gridTemplateColumns: 'repeat(3, 250px)',
        gridTemplateRows: 'repeat(4, 150px)',
        gap: '32px',
      },
    }

    calculateGridLayoutMock.mockReturnValue(layout)

    const ref = { current: div }
    const { result } = renderHook(() => useLayout(ref, count))

    expect(result.current).toEqual({
      columns: 3,
      rows: 4,
    })

    expect(calculateGridLayout).toBeCalledWith(width, height, count)

    expect(div).toHaveStyle(layout.style)
    expect(div.style.height).toBe('')
  })

  test('observes parent element for size changes', () => {
    const resizeObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    const ResizeObserver = vi.fn().mockReturnValue(resizeObserver)

    vi.stubGlobal('ResizeObserver', ResizeObserver)

    const count = 10

    const width = 800
    const height = 600

    const div = document.createElement('div')
    vi.spyOn(div, 'clientWidth', 'get').mockReturnValue(width)
    vi.spyOn(div, 'clientHeight', 'get').mockReturnValue(height)
    vi.spyOn(div, 'parentElement', 'get').mockReturnValue(document.body)

    const layout = {
      columns: 3,
      rows: 4,
      style: {
        gridTemplateColumns: 'repeat(3, 250px)',
        gridTemplateRows: 'repeat(4, 150px)',
        gap: '32px',
      },
    }

    calculateGridLayoutMock.mockReturnValue(layout)

    const ref = { current: div }
    const { unmount } = renderHook(() => useLayout(ref, count))

    expect(ResizeObserver).toHaveBeenCalledWith(expect.any(Function))
    expect(resizeObserver.observe).toHaveBeenCalledWith(document.body)

    unmount()

    expect(resizeObserver.disconnect).toHaveBeenCalled()
  })

  test('does not observer parent element if it does not exist', () => {
    const ResizeObserver = vi.fn()

    vi.stubGlobal('ResizeObserver', ResizeObserver)

    const count = 10

    const width = 800
    const height = 600

    const div = document.createElement('div')
    vi.spyOn(div, 'clientWidth', 'get').mockReturnValue(width)
    vi.spyOn(div, 'clientHeight', 'get').mockReturnValue(height)

    const layout = {
      columns: 3,
      rows: 4,
      style: {
        gridTemplateColumns: 'repeat(3, 250px)',
        gridTemplateRows: 'repeat(4, 150px)',
        gap: '32px',
      },
    }

    calculateGridLayoutMock.mockReturnValue(layout)

    const ref = { current: div }
    renderHook(() => useLayout(ref, count))

    expect(ResizeObserver).not.toHaveBeenCalled()
  })

  test('returns default layout if ref is null', () => {
    const count = 10

    const ref = { current: null }
    const { result } = renderHook(() => useLayout(ref, count))

    expect(result.current).toEqual({
      columns: 0,
      rows: 0,
    })

    expect(calculateGridLayout).not.toHaveBeenCalled()
    expect(calculateSingleAxisLayout).not.toHaveBeenCalled()
  })
})
