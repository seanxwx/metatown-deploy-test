import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { Loader } from 'lucide-react'
import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import IconButton from '@/components/IconButton'
import SpaceFormModal from '@/components/SpaceFormModal'
import Tooltip from '@/components/Tooltip'
import VerticalList from '@/components/VerticalList'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useSpace from '@/hooks/useSpace'
import useLastVisitedSpaces from '@/hooks/useLastVisitedSpaces'
import CopyInviteLink from './components/CopyInviteLink'
import LastVisitedSpace from './components/LastVisitedSpace'

interface Props {
  onEditSpace: () => void
}

const Header: FC<Props> = ({ onEditSpace }) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: ownedSpaces } = useOwnedSpaces()

  const { data: lastVisitedSpaces, isLoading: isLastVisitedSpacesLoading } =
    useLastVisitedSpaces()

  const isOwner = ownedSpaces?.some((ownedSpace) => ownedSpace.id === space?.id)

  const [isSpaceFormModalOpen, setIsSpaceFormModalOpen] = useState(false)

  if (!space) {
    return null
  }

  return (
    <>
      <header className="flex justify-between border-b border-neutral-200 px-6 py-2">
        <CopyInviteLink spaceId={space.id} />

        <Dropdown
          trigger={(toggle, isOpen) => (
            <Tooltip text="My Spaces" position="bottom">
              <Button
                size="small"
                prefix={{ icon: 'sparkles' }}
                suffix={{ icon: 'chevron-down' }}
                variant={isOpen ? 'secondary' : 'underline'}
                onClick={toggle}
              >
                {space.name}
              </Button>
            </Tooltip>
          )}
        >
          {isLastVisitedSpacesLoading ? (
            <Loader
              className="animate-spin"
              role="status"
              aria-label="Loading"
            />
          ) : (
            <VerticalList>
              {lastVisitedSpaces?.map((lastVisitedSpace) => (
                <div key={lastVisitedSpace.id}>
                  <VerticalList.Item>
                    <LastVisitedSpace
                      name={lastVisitedSpace.name}
                      spaceId={lastVisitedSpace.id}
                    />
                  </VerticalList.Item>
                </div>
              ))}
            </VerticalList>
          )}
        </Dropdown>

        <div className="flex gap-1">
          {isOwner && (
            <Dropdown
              trigger={(toggle, isOpen) => (
                <IconButton
                  size="small"
                  onClick={toggle}
                  variant={isOpen ? 'secondary' : 'naked'}
                  icon="cog"
                  label="More options"
                  tooltip={{ position: 'bottom-right' }}
                />
              )}
              position="bottom-right"
            >
              <VerticalList>
                <VerticalList.Item>
                  <Button
                    onClick={() => setIsSpaceFormModalOpen(true)}
                    variant="underline"
                    prefix={{ icon: 'edit' }}
                  >
                    Change Space name
                  </Button>
                </VerticalList.Item>
                <VerticalList.Item>
                  <Button
                    onClick={onEditSpace}
                    variant="underline"
                    prefix={{ icon: 'pencil-ruler' }}
                  >
                    Edit Space
                  </Button>
                </VerticalList.Item>
              </VerticalList>
            </Dropdown>
          )}
        </div>
      </header>
      {isSpaceFormModalOpen && (
        <SpaceFormModal
          title="Change Space name"
          spaceId={space.id}
          onClose={() => setIsSpaceFormModalOpen(false)}
        />
      )}
    </>
  )
}

export default Header
