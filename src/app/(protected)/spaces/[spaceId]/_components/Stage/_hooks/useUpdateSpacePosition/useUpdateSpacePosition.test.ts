import { renderHook } from '@testing-library/react'
import { act } from 'react'
import broadcastUserMovement from '@/db/broadcastUserMovement'
import upsertSpacePosition from '@/db/upsertSpacePosition'
import useUpdateSpacePosition from './useUpdateSpacePosition'

vi.mock('@/db/upsertSpacePosition')

vi.mock('@/db/broadcastUserMovement')

describe('useUpdateSpacePosition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })

  test('does not call upsertSpacePosition if user is not moving', async () => {
    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'S' as const,
      isMoving: false,
    }

    renderHook(() => useUpdateSpacePosition(userPosition))

    await act(() => vi.advanceTimersToNextTimer())

    expect(upsertSpacePosition).not.toHaveBeenCalled()
  })

  test('broadcasts user movement on every move', () => {
    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'S' as const,
      isMoving: false,
    }

    const { rerender } = renderHook(
      (props) => useUpdateSpacePosition(props.userPosition),
      {
        initialProps: { userPosition },
      }
    )

    expect(broadcastUserMovement).toHaveBeenCalledWith(userPosition)

    rerender({ userPosition: { ...userPosition, y: 1 } })
    expect(broadcastUserMovement).toHaveBeenCalledWith({
      ...userPosition,
      y: 1,
    })

    rerender({ userPosition: { ...userPosition, y: 2 } })
    expect(broadcastUserMovement).toHaveBeenCalledWith({
      ...userPosition,
      y: 2,
    })
  })

  test('calls upsertSpacePosition on every timer when the position change', async () => {
    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'S' as const,
      isMoving: false,
    }

    const { rerender } = renderHook(
      (props) => useUpdateSpacePosition(props.userPosition),
      {
        initialProps: { userPosition },
      }
    )

    expect(upsertSpacePosition).not.toHaveBeenCalled()

    rerender({ userPosition: { ...userPosition, y: 1 } })

    await act(() => vi.advanceTimersToNextTimer())

    expect(upsertSpacePosition).toBeCalledTimes(1)
    expect(upsertSpacePosition).toBeCalledWith({ ...userPosition, y: 1 })

    rerender({ userPosition: { ...userPosition, y: 2 } })
    expect(upsertSpacePosition).toBeCalledTimes(1)

    rerender({ userPosition: { ...userPosition, y: 3 } })
    expect(upsertSpacePosition).toBeCalledTimes(1)

    await act(() => vi.advanceTimersToNextTimer())
    expect(upsertSpacePosition).toBeCalledTimes(2)
    expect(upsertSpacePosition).toBeCalledWith({ ...userPosition, y: 3 })
  })
})
