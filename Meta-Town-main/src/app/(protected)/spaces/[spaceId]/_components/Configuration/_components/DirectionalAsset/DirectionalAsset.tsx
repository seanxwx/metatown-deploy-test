import { FC } from 'react'
import { Direction } from '@/app/types'
import Button from '@/components/Button'
import Canvas from './_components/Canvas'

interface Props {
  title: string
  name: 'wall' | 'chair'
  onClick: (direction: Direction) => void
  isActive: (direction: Direction) => boolean
}

const DirectionalAsset: FC<Props> = ({ title, name, onClick, isActive }) => (
  <div className="space-y-2">
    <p>{title}</p>
    <div className="space-x-4">
      {(['N', 'S', 'E', 'W'] as const).map((direction) => (
        <Button
          onClick={() => onClick(direction)}
          size="large"
          variant={isActive(direction) ? 'success' : 'secondary'}
          key={direction}
        >
          <Canvas name={name} direction={direction} />
        </Button>
      ))}
    </div>
  </div>
)

export default DirectionalAsset
