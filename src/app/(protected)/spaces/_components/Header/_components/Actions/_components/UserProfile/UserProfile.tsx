'use client'

import { FC, useState } from 'react'
import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import ProfileFormModal from '@/components/ProfileFormModal'
import VerticalList from '@/components/VerticalList'
import useSession from '@/hooks/useSession'
import useSessionUser from '@/hooks/useSessionUser'
import Avatar from '@/components/Avatar'
import SignOut from './_components/SignOut'

const UserProfile: FC = () => {
  const { data: user } = useSessionUser()
  const { data: session } = useSession()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!session) {
    return
  }

  const displayName = user?.displayName ?? session.user.email

  return (
    <div>
      <Dropdown
        position="bottom-right"
        trigger={(toggle, isOpen) => (
          <Button
            onClick={toggle}
            variant={isOpen ? 'secondary' : 'light'}
            aria-label={displayName}
            className="flex items-center gap-3"
          >
            {user && <Avatar character={user.avatar} name={user.avatar} />}
            {displayName}
          </Button>
        )}
        size="small"
        variant="dark"
      >
        <VerticalList>
          <VerticalList.Item>
            <Button
              variant="light"
              prefix={{ icon: 'user-pen' }}
              onClick={() => setIsEditModalOpen(true)}
              className="w-full"
            >
              Edit Profile
            </Button>
          </VerticalList.Item>
          <VerticalList.Item>
            <SignOut />
          </VerticalList.Item>
        </VerticalList>
      </Dropdown>
      {isEditModalOpen && (
        <ProfileFormModal
          title="Edit Your Profile"
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
}

export default UserProfile
