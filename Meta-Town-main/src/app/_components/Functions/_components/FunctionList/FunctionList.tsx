import { FC } from 'react'
import {
  UserRound,
  SquareUserRound,
  Monitor,
  MessageCircleMore,
  ShieldCheck,
  CloudFog,
  Bell,
} from 'lucide-react'

export const FUNCTIONS = [
  {
    icon: UserRound,
    title: 'Registration & Login',
    description:
      'Quickly register via email or a third-party account to personalize your personal information.',
  },
  {
    icon: SquareUserRound,
    title: 'Avatar & Movement',
    description:
      'Customize exclusive virtual image, support clothing, accessories customization, free movement in the virtual world.',
  },
  {
    icon: Monitor,
    title: 'Online Meetings',
    description:
      'Create or join online meetings, support video, screen sharing and other functions, anytime, anywhere communication and collaboration.',
  },
  {
    icon: MessageCircleMore,
    title: 'Chat & Message',
    description:
      'Real-time communication, support text, pictures, expressions, keep the team efficient communication.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure SSO Login',
    description:
      'Secure and easy access to the office platform with single sign-on (SSO).',
  },
  {
    icon: CloudFog,
    title: 'Virtual Collaboration',
    description:
      'Share virtual whiteboard, office area, custom layout, enhance team interaction experience.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description:
      'Keep up to date with meetings, tasks, and important news to ensure you don’t miss any details.',
  },
] as const

const FunctionList: FC = () => (
  <section className="space-y-6 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
    {FUNCTIONS.map(({ icon: Icon, title, description }) => (
      <div
        role="listitem"
        aria-label={title}
        key={title}
        className="flex items-start space-x-5 md:space-x-7"
      >
        <div className="rounded-full bg-[#6459e5] p-2 md:p-3">
          <Icon
            strokeWidth={1.5}
            className="h-5 w-5 text-white md:h-7 md:w-7"
          />
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="font-medium md:text-2xl">{title}</div>
          <div className="text-xs text-[#c6c6dd] opacity-75 md:text-base">
            {description}
          </div>
        </div>
      </div>
    ))}
  </section>
)

export default FunctionList
