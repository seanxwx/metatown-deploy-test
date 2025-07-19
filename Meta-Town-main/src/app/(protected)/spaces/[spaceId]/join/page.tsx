'use client'

import { useParams } from 'next/navigation'
import { FC, useEffect } from 'react'
import GlobalLoading from '@/components/GlobalLoading'
import joinSpace from '@/db/joinSpace'
import useJoinedSpaces from '@/hooks/useJoinedSpaces'
import navigate from '@/utils/navigate'
import useSessionUser from '@/hooks/useSessionUser'

const Join: FC = () => {
  const { data: user } = useSessionUser()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: joinSpaces, isLoading } = useJoinedSpaces()

  useEffect(() => {
    if (!user || isLoading) {
      return
    }

    const handleJoinSpace = async (): Promise<void> => {
      const hasJoinedSpace = joinSpaces
        ?.map((space) => space.id)
        .includes(spaceId)
      if (!hasJoinedSpace) {
        await joinSpace({ spaceId, userId: user.id })
      }

      navigate(`/spaces/${spaceId}`)
    }

    void handleJoinSpace()
  }, [user, spaceId, isLoading, joinSpaces])

  return <GlobalLoading />
}

export default Join
