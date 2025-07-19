import { FC } from 'react'
import Logo from '@/components/Logo'
import IconButton from '@/components/IconButton'
import Navigation from './_components/Navigation'
import Actions from './_components/Actions'

const Header: FC = () => (
  <header className="flex items-center justify-between py-2.5 text-white">
    <Logo variant="dark" />
    <IconButton
      icon="align-justify"
      label="Options"
      variant="naked"
      className="-mr-3.5 md:hidden"
    />
    <div className="hidden gap-14 md:flex">
      <Navigation />
      <Actions />
    </div>
  </header>
)

export default Header
