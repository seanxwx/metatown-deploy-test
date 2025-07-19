import { FC } from 'react'
import useUser from '@/hooks/useUser'

interface Props {
  userId: string
}

const UserSharing: FC<Props> = ({ userId }) => {
  const { data: user } = useUser(userId)

  if (!user) {
    return null
  }

  return (
    <div className="absolute left-4 top-2 flex items-center whitespace-nowrap rounded-2xl bg-neutral-300 px-2 py-1 text-sm">
      {user.displayName} is Sharing
    </div>
  )
}

export default UserSharing
