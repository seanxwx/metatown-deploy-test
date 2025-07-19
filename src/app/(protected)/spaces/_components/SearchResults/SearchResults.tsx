import { FC } from 'react'
import { Loader } from 'lucide-react'
import useSearchSpaces from '@/hooks/useSearchSpaces'
import SpacePreview from '../SpacePreview'

interface Props {
  searchQuery: string
}

const SearchResults: FC<Props> = ({ searchQuery }) => {
  const { data: spaces, isLoading } = useSearchSpaces(searchQuery)

  if (isLoading) {
    return (
      <Loader className="animate-spin" role="status" aria-label="Loading" />
    )
  }

  if (spaces?.length === 0) {
    return (
      <div className="mt-64 text-center text-gray-500">No spaces found!</div>
    )
  }

  return (
    <div
      className="grid grid-cols-4 gap-6"
      role="group"
      aria-label="Searched spaces"
    >
      {spaces?.map((space) => (
        <SpacePreview key={space.id} name={space.name} spaceId={space.id} />
      ))}
    </div>
  )
}

export default SearchResults
