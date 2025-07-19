import { FC } from 'react'
import Button from '@/components/Button'
import Logo from '@/components/Logo'

const Navigation: FC = () => (
  <div className="flex items-center gap-4">
    <Logo className="mr-12 h-8" variant="dark" />
    <Button variant="naked" prefix={{ icon: 'calendar' }}>
      Events
    </Button>
    <Button variant="light" prefix={{ icon: 'sparkles' }}>
      My Spaces
    </Button>
  </div>
)

export default Navigation
