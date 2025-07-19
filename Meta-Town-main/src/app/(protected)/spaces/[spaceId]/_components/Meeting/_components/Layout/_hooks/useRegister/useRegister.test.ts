import { renderHook } from '@testing-library/react'
import { act } from 'react'
import useRegister from './useRegister'

describe('useRegister', () => {
  test('returns initial register as an empty object', () => {
    const { result } = renderHook(() => useRegister())

    expect(result.current.register).toEqual({})
  })

  test('ref callback updates register with the element', () => {
    const { result } = renderHook(() => useRegister())

    const element = document.createElement('div')
    element.dataset.id = 'PLACEHOLDER_ID'

    act(() => {
      result.current.ref(element)
    })

    expect(result.current.register).toEqual({ [element.dataset.id]: element })
  })

  test('ref callback does not update register if element has no data-id', () => {
    const { result } = renderHook(() => useRegister())

    const element = document.createElement('div')

    act(() => {
      result.current.ref(element)
    })

    expect(result.current.register).toEqual({})
  })
})
