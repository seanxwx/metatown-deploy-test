import Link from 'next/link'
import { FC } from 'react'

export const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact Sales', href: '/contact-sales' },
  { name: 'Help Center', href: '/help-center' },
] as const

const Navigation: FC = () => (
  <div className="mt-6 flex flex-wrap md:mt-0 md:flex-nowrap md:gap-4 xl:gap-[56px]">
    {LINKS.map(({ name, href }) => (
      <Link
        key={name}
        href={href}
        className="mb-5 w-1/2 hover:text-green-400 md:mb-0 md:w-auto"
      >
        {name}
      </Link>
    ))}
  </div>
)

export default Navigation
