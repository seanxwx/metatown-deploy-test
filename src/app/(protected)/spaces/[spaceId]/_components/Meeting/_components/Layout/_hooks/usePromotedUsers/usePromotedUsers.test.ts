import { renderHook } from '@testing-library/react'
import { act } from 'react'
import usePromotedUsers from './usePromotedUsers'

describe('usePromotedUsers', () => {
  test('returns promoted users sorted by speaking time', async () => {
    vi.useFakeTimers()

    const users = ['user1', 'user2', 'user3']
    const length = 2

    const { result } = renderHook(() => usePromotedUsers(users, length))

    expect(result.current.promotedUsers).toEqual(['user1', 'user2'])

    act(() => result.current.handleSpeak('user3'))

    expect(result.current.promotedUsers).toEqual(['user1', 'user2'])

    await act(() => vi.advanceTimersToNextTimer())

    expect(result.current.promotedUsers).toEqual(['user3', 'user1'])

    act(() => result.current.handleSpeak('user1'))

    await act(() => vi.advanceTimersToNextTimer())

    expect(result.current.promotedUsers).toEqual(['user3', 'user1'])
  })
})
