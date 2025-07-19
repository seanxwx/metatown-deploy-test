import { FC } from 'react'
import LayoutContainer from '@/components/LayoutContainer'
import Actions from './_components/Actions'
import Navigation from './_components/Navigation'

const Header: FC = () => (
  <header className="bg-[#221540]">
    <LayoutContainer className="flex justify-between py-4 text-white">
      <Navigation />
      <Actions />
    </LayoutContainer>
  </header>
)

export default Header
