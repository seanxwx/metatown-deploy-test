import { fireEvent, renderHook } from '@testing-library/react'
import { act } from 'react'
import useDrag from './useDrag'

describe('useDrag', () => {
  test('drags element by setting style', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const handle = document.createElement('div')

    target.appendChild(handle)

    const { result, rerender } = renderHook(() => useDrag())

    const { targetRef, handleRef } = result.current

    targetRef.current = target
    handleRef.current = handle
    rerender()

    fireEvent.mouseDown(handle)
    fireEvent.mouseMove(document, {
      clientX: 50,
      clientY: 100,
    })
    fireEvent.mouseUp(document)

    expect(result.current.style).toEqual({
      left: '50px',
      top: '100px',
    })

    act(() => result.current.reset())

    expect(result.current.style).toEqual({})

    document.body.removeChild(target)
  })

  test('does not drag element if target is not handle', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const handle = document.createElement('div')

    target.appendChild(handle)

    const { result, rerender } = renderHook(() => useDrag())

    const { targetRef, handleRef } = result.current

    targetRef.current = target
    handleRef.current = handle

    const other = document.createElement('div')
    document.body.appendChild(handle)
    document.body.appendChild(other)

    rerender()

    fireEvent.mouseDown(other)
    fireEvent.mouseMove(document, {
      clientX: 50,
      clientY: 100,
    })
    fireEvent.mouseUp(document)

    expect(result.current.style).toEqual({})

    document.body.removeChild(handle)
    document.body.removeChild(other)
  })

  test('does not drag element if target is not in parent', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    vi.spyOn(target, 'parentElement', 'get').mockReturnValue(null)

    const { result, rerender } = renderHook(() => useDrag())

    const { targetRef } = result.current

    targetRef.current = target
    rerender()

    fireEvent.mouseDown(target)
    fireEvent.mouseMove(document, {
      clientX: 50,
      clientY: 100,
    })
    fireEvent.mouseUp(document)

    expect(result.current.style).toEqual({})

    document.body.removeChild(target)
  })
})
