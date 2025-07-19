import { FC } from 'react'
import { Loader } from 'lucide-react'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import SpacePreview from '../SpacePreview'

const OwnedSpaces: FC = () => {
  const { data: ownedSpaces, isLoading } = useOwnedSpaces()

  if (isLoading) {
    return (
      <Loader className="animate-spin" role="status" aria-label="Loading" />
    )
  }

  return (
    <div
      className="grid grid-cols-4 flex-wrap gap-6"
      role="group"
      aria-label="Owned spaces"
    >
      {ownedSpaces?.map((space) => (
        <SpacePreview key={space.id} name={space.name} spaceId={space.id} />
      ))}
    </div>
  )
}

export default OwnedSpaces
