import { CircleCheck } from 'lucide-react'
import { FC } from 'react'
import Button from '@/components/Button'
import navigate from '@/utils/navigate'

const FEATURES = [
  'Immersive teaching experience',
  'Quickly build a close team atmosphere',
  'Improve the ability to learn independently',
] as const

const Content: FC = () => (
  <div className="space-y-8 md:space-y-24">
    <div className="space-y-6 md:space-y-10">
      <h1 className="text-[40px] font-black leading-[1.2] md:text-[60px] md:leading-[1.4]">
        Australia&apos;s Original Online Interactive Learning Platform
      </h1>
      <ul className="mb-8 space-y-4 text-sm leading-[1.45] md:mb-0 md:space-y-5 md:text-base md:leading-[1.25]">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex gap-3">
            <CircleCheck aria-label="CircleCheck" size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="text-center md:text-left">
      <Button
        variant="success"
        onClick={() => navigate('/authentication/sign-up')}
        className="md:px-10"
      >
        Get started
      </Button>
    </div>
  </div>
)

export default Content
