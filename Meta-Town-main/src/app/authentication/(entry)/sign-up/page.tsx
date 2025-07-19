import { FC } from 'react'
import Link from 'next/link'
import HeroCardLayout from '@/components/HeroCardLayout'
import Form from './_component/Form'

const SignUp: FC = () => (
  <HeroCardLayout title="Sign Up!" subtitle="Step Into Your Virtual World">
    <div className="space-y-6">
      <Form />
      <p className="text-sm text-neutral-400 md:text-base">
        Already have an account? &nbsp;
        <Link href="/authentication/login" className="font-bold text-[#6459e5]">
          Login now!
        </Link>
      </p>
    </div>
  </HeroCardLayout>
)

export default SignUp
