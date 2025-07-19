import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import upsertSpacePresence from '@/db/upsertSpacePresence'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUserPresences from '@/hooks/useUserPresences'

const useSyncSpacePresence = (): void => {
  const { data: user } = useSessionUser()

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { mutate } = useUserPresences(space?.id)

  useEffect(() => {
    if (!user?.id || !space?.id) {
      return
    }

    const handleOnline = async (): Promise<void> => {
      await upsertSpacePresence({
        userId: user.id,
        spaceId: space.id,
        status: 'ONLINE',
      })

      await mutate()
    }

    const handleOffline = async (): Promise<void> => {
      await upsertSpacePresence({
        userId: user.id,
        spaceId: space.id,
        status: 'OFFLINE',
      })

      await mutate()
    }

    void handleOnline()

    const interval = setInterval(() => {
      void handleOnline()
    }, 15000)

    return (): void => {
      void handleOffline()

      clearInterval(interval)
    }
  }, [user?.id, space?.id, mutate])
}

export default useSyncSpacePresence
