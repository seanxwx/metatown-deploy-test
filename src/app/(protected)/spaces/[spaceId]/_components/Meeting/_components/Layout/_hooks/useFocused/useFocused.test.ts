import { renderHook } from '@testing-library/react'
import { act } from 'react'
import useFocused from './useFocused'

describe('useFocused', () => {
  test('returns initial focused state as undefined', () => {
    const { result } = renderHook(() => useFocused([]))

    expect(result.current.focused).toBeUndefined()
  })

  test('handleFocus sets focused state to the provided value', () => {
    const { result } = renderHook(() => useFocused(['USER_ID']))

    const value = {
      userId: 'USER_ID',
      kind: 'participant',
    } as const

    act(() => {
      result.current.handleFocus(value)
    })

    expect(result.current.focused).toBe(value)
  })

  test('handleFocus setting focused state to null when there is a focused and then to the provided value', async () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useFocused(['USER_ID']))

    const value = {
      userId: 'USER_ID',
      kind: 'participant',
    } as const

    act(() => {
      result.current.handleFocus({
        userId: 'USER_ID',
        kind: 'screen',
      })
    })

    act(() => {
      result.current.handleFocus(value)
    })

    expect(result.current.focused).toBeNull()

    await act(() => vi.advanceTimersToNextFrame())

    expect(result.current.focused).toBe(value)

    vi.useRealTimers()
  })

  test('returns isTargetFocused as true when the userId and kind match the focused state', () => {
    const { result } = renderHook(() => useFocused(['USER_ID']))

    const value = {
      userId: 'USER_ID',
      kind: 'participant',
    } as const

    act(() => {
      result.current.handleFocus(value)
    })

    expect(result.current.isTargetFocused(value.userId, value.kind)).toBe(true)

    expect(result.current.isTargetFocused('OTHER_USER_ID', 'participant')).toBe(
      false
    )
  })

  test('returns null focused when screen and focused state is not match', () => {
    const { result } = renderHook(() =>
      useFocused([], { userId: 'SCREEN_USER_ID', kind: 'screen' })
    )

    act(() => {
      result.current.handleFocus({
        userId: 'OTHER_SCREEN_USER_ID',
        kind: 'screen',
      })
    })

    expect(result.current.focused).toBeNull()
  })

  test('returns null focused when can not find focused participant', () => {
    const { result } = renderHook(() => useFocused(['PARTICIPANT_USER_ID']))

    act(() => {
      result.current.handleFocus({
        userId: 'OTHER_PARTICIPANT_USER_ID',
        kind: 'participant',
      })
    })

    expect(result.current.focused).toBeNull()
  })

  test('returns focused as screen initially when screen is provided', () => {
    const screen = { userId: 'SCREEN_USER_ID', kind: 'screen' as const }
    const { result } = renderHook(() => useFocused([], screen))

    expect(result.current.focused).toEqual({
      userId: screen.userId,
      kind: 'screen',
    })
  })
})
