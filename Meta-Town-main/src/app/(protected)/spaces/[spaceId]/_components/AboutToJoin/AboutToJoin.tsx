import { FC } from 'react'
import HeroCardLayout from '@/components/HeroCardLayout'
import Button from '@/components/Button'
import WaveAndStarBackground from '@/components/WaveAndStarBackground'

interface Props {
  onClick: () => void
  spaceName: string
}

const AboutToJoin: FC<Props> = ({ onClick, spaceName }) => (
  <WaveAndStarBackground>
    <HeroCardLayout title={`You're about to join - ${spaceName}`}>
      <Button aria-label="Join space" className="w-full" onClick={onClick}>
        Join Space
      </Button>
    </HeroCardLayout>
  </WaveAndStarBackground>
)

export default AboutToJoin
