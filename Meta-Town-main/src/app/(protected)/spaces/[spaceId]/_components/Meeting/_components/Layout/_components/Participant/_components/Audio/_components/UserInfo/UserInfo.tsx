import { FC } from 'react'
import useUser from '@/hooks/useUser'
import MuteIndicator from './_components/MuteIndicator'

interface Props {
  userId: string
  isMuted?: boolean
}

const UserInfo: FC<Props> = ({ userId, isMuted = false }) => {
  const { data: user } = useUser(userId)

  if (!user) {
    return null
  }

  return (
    <div className="absolute left-4 top-2 flex items-center space-x-2 rounded-2xl bg-neutral-300 px-2 py-1 text-sm">
      <MuteIndicator isMuted={isMuted} />
      <span>{user.displayName}</span>
    </div>
  )
}

export default UserInfo
