import { FC } from 'react'
import Logo from '@/components/Logo'
import Navigation from './_components/Navigation'
import Social from './_components/Social'
import Policies from './_components/Policies'

const Footer: FC = () => (
  <div className="mb-10 mt-16 md:mt-[100px]">
    <div className="mb-10 border-t border-t-[#efefef]" />
    <div className="md:flex md:items-center md:justify-between">
      <Logo />
      <Navigation />
      <Social />
    </div>

    <div className="mt-8 md:mt-6 md:flex md:flex-row-reverse md:justify-between">
      <Policies />
      <p className="mt-6 text-[#727272] md:mt-0">
        © 2025 Meta Town Presence Inc.
      </p>
    </div>
  </div>
)

export default Footer
