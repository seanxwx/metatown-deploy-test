import { FC } from 'react'
import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import VerticalList from '@/components/VerticalList'
import navigate from '@/utils/navigate'

export const LINKS = [
  { name: 'Help Center', href: '/help-center' },
  { name: 'Product Update', href: '/product-update' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact Us', href: '/contact-us' },
  { name: 'Download', href: '/download' },
] as const

const Resources: FC = () => (
  <Dropdown
    trigger={(toggle, isOpen) => (
      <Button
        prefix={{ icon: 'circle-help' }}
        onClick={toggle}
        variant={isOpen ? 'light' : 'naked'}
      >
        Resources
      </Button>
    )}
    size="small"
    variant="dark"
  >
    <VerticalList>
      {LINKS.map((link) => (
        <VerticalList.Item key={link.name}>
          <Button variant="naked" onClick={() => navigate(link.href)}>
            {link.name}
          </Button>
        </VerticalList.Item>
      ))}
    </VerticalList>
  </Dropdown>
)

export default Resources
