import Link from 'next/link'
import { FC } from 'react'

export const LINKS = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
] as const

const Policies: FC = () => (
  <div className="flex md:gap-10">
    {LINKS.map(({ name, href }) => (
      <Link
        key={name}
        href={href}
        className="w-1/2 text-[#727272] hover:text-green-400 md:w-auto"
      >
        {name}
      </Link>
    ))}
  </div>
)

export default Policies
