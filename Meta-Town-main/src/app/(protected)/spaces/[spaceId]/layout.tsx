'use client'

import { useParams } from 'next/navigation'
import { FC, ReactNode, useState } from 'react'
import GlobalLoading from '@/components/GlobalLoading'
import useSpace from '@/hooks/useSpace'
import AboutToJoin from './_components/AboutToJoin'

interface Props {
  children: ReactNode
}

const SpaceLayout: FC<Props> = ({ children }) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space, isLoading } = useSpace(spaceId)

  const [showAboutToJoin, setShowAboutToJoin] = useState(true)

  if (isLoading) {
    return <GlobalLoading />
  }

  if (!space) {
    return <div>404</div>
  }

  return showAboutToJoin ? (
    <AboutToJoin
      spaceName={space.name}
      onClick={() => setShowAboutToJoin(false)}
    />
  ) : (
    children
  )
}

export default SpaceLayout
