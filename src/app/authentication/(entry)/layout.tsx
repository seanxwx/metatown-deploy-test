import { FC, ReactNode } from 'react'
import WaveAndStarBackground from '@/components/WaveAndStarBackground'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => (
  <WaveAndStarBackground className="relative">{children}</WaveAndStarBackground>
)

export default Layout
