import { fireEvent, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Position } from '@/app/types'
import useMovement, { MOVE_INTERVAL } from './useMovement'

describe('useMovement', () => {
  test('initializes with given movement', () => {
    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'S' as const,
      isMoving: false,
    }

    const { result } = renderHook(() =>
      useMovement(userPosition, { rows: 2, columns: 2 }, [])
    )

    expect(result.current).toEqual(userPosition)
  })

  test('does not move if the last movement occurred within the interval limits', async () => {
    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 5,
      y: 5,
      direction: 'S' as const,
      isMoving: false,
    }

    const user = userEvent.setup()

    const { result } = renderHook(() =>
      useMovement(userPosition, { rows: 8, columns: 8 }, [])
    )

    await user.keyboard('{arrowUp}')
    await user.keyboard('{arrowUp}')
    expect(result.current).toEqual({
      ...userPosition,
      y: 4,
      direction: 'N',
      isMoving: false,
    })
  })

  test.each([
    {
      name: 'does not move',
      movement: { x: 1, y: 1, direction: 'S', isMoving: false },
      key: 'q',
      expected: { x: 1, y: 1, direction: 'S', isMoving: false },
    },
    {
      name: 'moves up',
      movement: { x: 0, y: 1, direction: 'S', isMoving: false },
      key: '{arrowUp}',
      expected: { x: 0, y: 0, direction: 'N', isMoving: false },
    },
    {
      name: 'moves down',
      movement: { x: 0, y: 0, direction: 'N', isMoving: false },
      key: '{arrowDown}',
      expected: { x: 0, y: 1, direction: 'S', isMoving: false },
    },
    {
      name: 'moves left',
      movement: { x: 1, y: 0, direction: 'E', isMoving: false },
      key: '{arrowLeft}',
      expected: { x: 0, y: 0, direction: 'W', isMoving: false },
    },
    {
      name: 'moves right',
      movement: { x: 0, y: 0, direction: 'W', isMoving: false },
      key: '{arrowRight}',
      expected: { x: 1, y: 0, direction: 'E', isMoving: false },
    },
    {
      name: 'moves up',
      movement: { x: 0, y: 1, direction: 'S', isMoving: false },
      key: 'w',
      expected: { x: 0, y: 0, direction: 'N', isMoving: false },
    },
    {
      name: 'moves down',
      movement: { x: 0, y: 0, direction: 'N', isMoving: false },
      key: 's',
      expected: { x: 0, y: 1, direction: 'S', isMoving: false },
    },
    {
      name: 'moves left',
      movement: { x: 1, y: 0, direction: 'E', isMoving: false },
      key: 'a',
      expected: { x: 0, y: 0, direction: 'W', isMoving: false },
    },
    {
      name: 'moves right',
      movement: { x: 0, y: 0, direction: 'W', isMoving: false },
      key: 'd',
      expected: { x: 1, y: 0, direction: 'E', isMoving: false },
    },
    {
      name: 'moves up',
      movement: { x: 0, y: 1, direction: 'S', isMoving: false },
      key: 'W',
      expected: { x: 0, y: 0, direction: 'N', isMoving: false },
    },
    {
      name: 'moves down',
      movement: { x: 0, y: 0, direction: 'N', isMoving: false },
      key: 'S',
      expected: { x: 0, y: 1, direction: 'S', isMoving: false },
    },
    {
      name: 'moves left',
      movement: { x: 1, y: 0, direction: 'E', isMoving: false },
      key: 'A',
      expected: { x: 0, y: 0, direction: 'W', isMoving: false },
    },
    {
      name: 'moves right',
      movement: { x: 0, y: 0, direction: 'W', isMoving: false },
      key: 'D',
      expected: { x: 1, y: 0, direction: 'E', isMoving: false },
    },
  ] as const)('$name', async ({ movement, key, expected }) => {
    const user = userEvent.setup()

    const { result } = renderHook(() =>
      useMovement(
        {
          id: 'USER_POSITION_ID',
          userId: 'USER_ID',
          spaceId: 'SPACE_ID',
          ...movement,
        },
        { rows: 2, columns: 2 },
        []
      )
    )

    await user.keyboard(key)

    expect(result.current).toEqual({
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      ...expected,
    })
  })

  const dimensions = { rows: 4, columns: 4 }

  test.each([
    {
      name: 'stops at upper left corner',
      movement: { x: 0, y: 0, direction: 'S', isMoving: false },
      keys: ['{arrowUp}', '{arrowLeft}'],
      expected: { x: 0, y: 0, direction: 'W', isMoving: false },
    },
    {
      name: 'stops at lower right corner',
      movement: {
        x: dimensions.columns - 1,
        y: dimensions.rows - 1,
        direction: 'N',
        isMoving: false,
      },
      keys: ['{arrowDown}', '{arrowRight}'],
      expected: {
        x: dimensions.columns - 1,
        y: dimensions.rows - 1,
        direction: 'E',
        isMoving: false,
      },
    },
  ] as const)('$name', async ({ movement, keys, expected }) => {
    const user = userEvent.setup()

    const { result } = renderHook(() =>
      useMovement(
        {
          id: 'USER_POSITION_ID',
          userId: 'USER_ID',
          spaceId: 'SPACE_ID',
          ...movement,
        },
        {
          rows: dimensions.rows,
          columns: dimensions.columns,
        },
        []
      )
    )

    for (const key of keys) {
      await user.keyboard(key)
      await new Promise((resolve) => setTimeout(resolve, MOVE_INTERVAL + 1))
    }

    expect(result.current).toEqual({
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      ...expected,
    })
  })

  test('does not move when interacting with an editable element', async () => {
    const user = userEvent.setup()

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'N' as const,
      isMoving: false,
    }

    const { result } = renderHook(
      () =>
        useMovement(
          userPosition,
          {
            rows: 4,
            columns: 4,
          },
          []
        ),
      {
        wrapper: ({ children }) => (
          <>
            <input placeholder="input" />
            <textarea placeholder="textarea" />
            <div contentEditable data-testid="editable" />
            {children}
          </>
        ),
      }
    )

    await user.click(screen.getByPlaceholderText('input'))
    await user.keyboard('{arrowDown}')
    expect(result.current).toEqual(userPosition)

    await user.click(screen.getByPlaceholderText('textarea'))
    await user.keyboard('{arrowDown}')
    expect(result.current).toEqual(userPosition)

    await user.click(screen.getByTestId('editable'))
    await user.keyboard('{arrowDown}')
    expect(result.current).toEqual(userPosition)

    await user.click(document.body)
    await user.keyboard('{arrowDown}')
    expect(result.current).toEqual({
      ...userPosition,
      y: 1,
      direction: 'S',
      isMoving: false,
    })
  })

  test('stops at block', async () => {
    vi.useFakeTimers()

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    })

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 1,
      y: 1,
      direction: 'S' as const,
      isMoving: false,
    }
    const blocks: Position[] = [{ x: 2, y: 2, direction: 'N' }]

    const { result, rerender } = renderHook(
      (props) => useMovement(userPosition, dimensions, props.blocks),
      { initialProps: { blocks } }
    )

    await user.keyboard('{arrowRight}')

    vi.advanceTimersToNextTimer()
    await user.keyboard('{arrowDown}')

    expect(result.current).toEqual({
      ...userPosition,
      x: 2,
      y: 1,
      direction: 'E',
      isMoving: false,
    })

    const newBlocks: Position[] = [{ x: 3, y: 1, direction: 'N' }]
    rerender({ blocks: newBlocks })

    vi.advanceTimersToNextTimer()
    await user.keyboard('{arrowRight}')

    expect(result.current).toEqual({
      ...userPosition,
      x: 2,
      y: 1,
      direction: 'E',
      isMoving: false,
    })

    vi.useRealTimers()
  })

  test('does not stop at block if pressing shift key while movement', async () => {
    const user = userEvent.setup()

    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 1,
      y: 1,
      direction: 'S' as const,
      isMoving: false,
    }

    const { result } = renderHook(() =>
      useMovement(userPosition, dimensions, [{ x: 2, y: 1, direction: 'N' }])
    )

    await user.keyboard('{Shift>}')
    await user.keyboard('{arrowRight}')
    expect(result.current).toEqual({
      ...userPosition,
      direction: 'E',
      isMoving: false,
      x: 2,
      y: 1,
    })
  })

  test('returns isMoving on key presses and release', () => {
    const userPosition = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 1,
      y: 1,
      direction: 'S' as const,
      isMoving: false,
    }

    const { result } = renderHook(() =>
      useMovement(userPosition, dimensions, [])
    )

    fireEvent(window, new KeyboardEvent('keydown', { key: 'ArrowUp' }))

    expect(result.current).toEqual({
      ...userPosition,
      x: 1,
      y: 0,
      direction: 'N',
      isMoving: true,
    })

    fireEvent(window, new KeyboardEvent('keyup'))
    expect(result.current).toEqual({
      ...userPosition,
      x: 1,
      y: 0,
      direction: 'N',
      isMoving: false,
    })
  })
})
