import { FC } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact Sales', href: '/contact-sales' },
] as const

export const ACTIVE = clsx('bg-white/10')

const Navigation: FC = () => {
  const pathName = usePathname()

  return (
    <nav className="flex items-center gap-10">
      {LINKS.map((link) => (
        <Link
          className={clsx(
            'rounded-lg px-2 py-1 text-center text-base leading-[1.25] text-white hover:bg-white/10',
            link.href === pathName && ACTIVE
          )}
          key={link.name}
          href={link.href}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
