import { FC } from 'react'
import { Loader } from 'lucide-react'
import useLastVisitedSpaces from '@/hooks/useLastVisitedSpaces'
import SpacePreview from '../SpacePreview'

const LastVisitedSpaces: FC = () => {
  const { data: lastVisitedSpaces, isLoading } = useLastVisitedSpaces()
  if (isLoading) {
    return (
      <Loader className="animate-spin" role="status" aria-label="Loading" />
    )
  }

  return (
    <div
      className="grid grid-cols-4 gap-6"
      role="group"
      aria-label="Last Visited Spaces"
    >
      {lastVisitedSpaces?.map((space) => (
        <SpacePreview key={space.id} name={space.name} spaceId={space.id} />
      ))}
    </div>
  )
}

export default LastVisitedSpaces
