import { FC } from 'react'
import Button from '@/components/Button'
import deleteSpace from '@/db/deleteSpace'
import leaveSpace from '@/db/leaveSpace'
import useJoinedSpaces from '@/hooks/useJoinedSpaces'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useSessionUser from '@/hooks/useSessionUser'

interface Props {
  spaceId: string
}

const DeleteOrLeaveButton: FC<Props> = ({ spaceId }) => {
  const { mutate: joinedSpacesMutate } = useJoinedSpaces()

  const { data: ownedSpaces, mutate: ownedSpacesMutate } = useOwnedSpaces()

  const { data: user } = useSessionUser()
  const isOwner = ownedSpaces?.some((ownedSpace) => ownedSpace.id === spaceId)

  const handleDelete = async (): Promise<void> => {
    await deleteSpace(spaceId)
    await ownedSpacesMutate()
  }

  const handleLeave = async (): Promise<void> => {
    if (!user?.id) {
      return
    }
    await leaveSpace({ userId: user.id, spaceId })
    await joinedSpacesMutate()
  }

  const handleClick = async (): Promise<void> => {
    if (isOwner) {
      await handleDelete()
    }

    await handleLeave()
  }

  return (
    <Button
      className="w-full"
      size="small"
      prefix={{
        icon: 'trash-2',
      }}
      variant="underline"
      onClick={() => void handleClick()}
    >
      {isOwner ? 'Delete' : 'Leave'}
    </Button>
  )
}

export default DeleteOrLeaveButton
