import { useEffect, useRef } from 'react'
import { Indexed, Movement } from '@/app/types'
import broadcastUserMovement from '@/db/broadcastUserMovement'
import upsertSpacePosition from '@/db/upsertSpacePosition'

const useUpdateSpacePosition = <
  T extends Indexed<Movement & { userId: string; spaceId: string }>,
>(
  userMovement: T
): void => {
  const userMovementRef = useRef(userMovement)

  useEffect(() => {
    userMovementRef.current = userMovement
  }, [userMovement])

  useEffect(() => {
    let lastUpdateUserMovement = userMovementRef.current

    const interval = setInterval(() => {
      const handleUpdateSpacePosition = async (): Promise<void> => {
        if (lastUpdateUserMovement === userMovementRef.current) {
          return
        }

        await upsertSpacePosition(userMovementRef.current)
        lastUpdateUserMovement = userMovementRef.current
      }

      void handleUpdateSpacePosition()
    }, 1000)

    return (): void => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    void broadcastUserMovement(userMovement)
  }, [userMovement])
}

export default useUpdateSpacePosition
