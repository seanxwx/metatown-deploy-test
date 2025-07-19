'use client'

import { FC, ReactNode } from 'react'
import useSession from '@/hooks/useSession'
import useSessionUser from '@/hooks/useSessionUser'
import GlobalLoading from '@/components/GlobalLoading'
import ProfileFormModal from '@/components/ProfileFormModal'

interface Props {
  children: ReactNode
}

const CreateUserGuard: FC<Props> = ({ children }) => {
  const { data: user, isLoading: isUserLoading } = useSessionUser()
  const { data: session, isLoading: isSessionLoading } = useSession()

  if (isUserLoading || isSessionLoading) {
    return <GlobalLoading />
  }

  if (!session) {
    return null
  }

  return (
    <div>
      {!user && <ProfileFormModal title="Create user" />}
      {children}
    </div>
  )
}

export default CreateUserGuard
