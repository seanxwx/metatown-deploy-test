import { FC } from 'react'
import Image from 'next/image'
import LayoutContainer from '@/components/LayoutContainer'
import GradientBackground from '@/components/GradientBackground'
import pattern from './assets/img/pattern.webp'
import Content from './_components/Content'

const CTABanner: FC = () => (
  <GradientBackground
    variant="light"
    className="relative mb-16 text-white md:mb-[100px]"
  >
    <div className="absolute bottom-0 h-80 w-full md:h-[480px]">
      <Image src={pattern} alt="Pattern" fill />
    </div>
    <LayoutContainer className="relative">
      <Content />
    </LayoutContainer>
  </GradientBackground>
)

export default CTABanner
