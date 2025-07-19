'use client'

import { FC, useState } from 'react'
import Button from '@/components/Button'
import SpaceFormModal from '@/components/SpaceFormModal'
import navigate from '@/utils/navigate'

const CreateSpace: FC = () => {
  const [isSpaceFormModalOpen, setIsSpaceFormModalOpen] = useState(false)

  const handleOnUpsert = (upsertedSpace: { id: string } | null): void => {
    if (!upsertedSpace) {
      return
    }

    navigate(`/spaces/${upsertedSpace.id}`)
  }

  return (
    <div>
      <Button
        variant="success"
        prefix={{ icon: 'circle-plus' }}
        onClick={() => setIsSpaceFormModalOpen(true)}
      >
        Create Spaces
      </Button>
      {isSpaceFormModalOpen && (
        <SpaceFormModal
          title="Create a new Space"
          onClose={() => setIsSpaceFormModalOpen(false)}
          onUpsert={handleOnUpsert}
        />
      )}
    </div>
  )
}

export default CreateSpace
