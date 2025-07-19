import { FC } from 'react'
import Participants from '@/components/Participants'
import Preview from './_components/Preview'
import Info from './_components/Info'

interface Props {
  name: string
  spaceId: string
}

const SpacePreview: FC<Props> = ({ name, spaceId }) => (
  <div>
    <div className="relative">
      <Preview spaceId={spaceId} />
      <div className="absolute left-4 top-4">
        <Participants spaceId={spaceId} />
      </div>
    </div>
    <Info name={name} spaceId={spaceId} />
  </div>
)

export default SpacePreview
