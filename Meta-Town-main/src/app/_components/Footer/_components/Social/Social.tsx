import { FC } from 'react'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

export const SOCIALS = ['linkedin', 'facebook', 'instagram'] as const

const ICONS = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
} as const

const Social: FC = () => (
  <div className="space-x-4">
    {SOCIALS.map((name) => {
      const Icon = ICONS[name]

      return (
        <button key={name}>
          <Icon size={16} aria-label={name} />
        </button>
      )
    })}
  </div>
)

export default Social
