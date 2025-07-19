import { FC } from 'react'
import Button from '@/components/Button'
import navigate from '@/utils/navigate'

const Content: FC = () => (
  <div className="space-y-6 py-[70px] text-center md:space-y-[90px] md:py-[120px]">
    <div className="space-y-6 md:space-y-10">
      <h2 className="mx-auto max-w-[345px] text-[26px] font-bold leading-[1.15] md:max-w-[945px] md:text-5xl md:leading-tight">
        Create A Let You of The Virtual Classroom Learning Team Full of Vitality
      </h2>
      <p className="mx-auto max-w-[345px] leading-[1.38] text-[#c6c6dd] md:max-w-[785px] md:text-lg md:leading-[1.33]">
        Whether you&apos;re a student or a teacher, Meta Town provides you with
        an immersive online learning environment that helps teams collaborate,
        communicate and grow more efficiently. Join now and experience an
        innovative virtual campus!
      </p>
    </div>
    <Button
      variant="secondary"
      onClick={() => navigate('/authentication/sign-up')}
      className="md:px-10"
    >
      Get started
    </Button>
  </div>
)

export default Content
