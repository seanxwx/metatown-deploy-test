import { useEffect, useRef, useState } from 'react'
import { Dimensions, Indexed, Movement, Position } from '@/app/types'
import clamp from '@/utils/clamp'
import isBlocked from '../../_utils/isBLocked'
import isEditing from './utils/isEditing'

const MOVE_DELTAS = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowRight: { dx: 1, dy: 0 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
} as const

const KEY_DIRECTIONS = {
  ArrowUp: 'N',
  ArrowRight: 'E',
  ArrowDown: 'S',
  ArrowLeft: 'W',
} as const

export const MOVE_INTERVAL = 1000 / 15

type ArrowKey = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft'

type WDSAKey = 'w' | 'd' | 's' | 'a'

const isArrowKey = (key: string): key is ArrowKey =>
  key === 'ArrowUp' ||
  key === 'ArrowRight' ||
  key === 'ArrowDown' ||
  key === 'ArrowLeft'

const isWDSAKey = (key: string): key is WDSAKey =>
  key === 'w' || key === 'a' || key === 's' || key === 'd'

const WDSA_ARROW_MAP: Record<WDSAKey, ArrowKey> = {
  w: 'ArrowUp',
  a: 'ArrowLeft',
  s: 'ArrowDown',
  d: 'ArrowRight',
}

type UserPosition = Indexed<Position & { userId: string; spaceId: string }>
type UserMovement = Indexed<Movement & { userId: string; spaceId: string }>

const useMovement = (
  initialPosition: UserPosition,
  dimensions: Dimensions,
  blocks: Position[]
): UserMovement => {
  const [movement, setMovement] = useState<UserMovement>({
    ...initialPosition,
    isMoving: false,
  })

  const lastMoveTimeRef = useRef<number>(0)
  const { rows, columns } = dimensions
  const blocksRef = useRef(blocks)

  useEffect(() => {
    blocksRef.current = blocks
  }, [blocks])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent): void => {
      if (isEditing(event)) {
        return
      }

      const lowerKey = event.key.toLowerCase()

      const key = isWDSAKey(lowerKey) ? WDSA_ARROW_MAP[lowerKey] : event.key

      if (!isArrowKey(key)) {
        return
      }

      event.preventDefault()

      const now = Date.now()
      if (now - lastMoveTimeRef.current < MOVE_INTERVAL) {
        return
      }

      lastMoveTimeRef.current = now

      const { dx, dy } = MOVE_DELTAS[key]
      const newDirection = KEY_DIRECTIONS[key]

      setMovement((previousMovement) => {
        const position: Position = {
          x: clamp(previousMovement.x + dx, 0, columns - 1),
          y: clamp(previousMovement.y + dy, 0, rows - 1),
          direction: newDirection,
        }

        const isForcedMoving = event.shiftKey

        if (!isForcedMoving && isBlocked(position, blocksRef.current)) {
          return {
            ...previousMovement,
            direction: newDirection,
            isMoving: true,
          }
        }

        return {
          ...previousMovement,
          ...position,
          isMoving: true,
        }
      })
    }

    const handleKeyUp = (): void =>
      setMovement((previousMovement) => ({
        ...previousMovement,
        isMoving: false,
      }))

    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyUp)

    return (): void => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [columns, rows])

  return movement
}

export default useMovement
