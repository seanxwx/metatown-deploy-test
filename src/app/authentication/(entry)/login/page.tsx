import { FC } from 'react'
import Link from 'next/link'
import HeroCardLayout from '@/components/HeroCardLayout'
import Form from './_component/Form'

const Login: FC = () => (
  <HeroCardLayout title="Welcome to Meta Town">
    <div className="space-y-6">
      <Form />
      <p className="text-sm text-neutral-400">
        Don&apos;t have an account? &nbsp;
        <Link
          href="/authentication/sign-up"
          className="font-bold text-[#6459e5]"
        >
          Sign up now!
        </Link>
      </p>
    </div>
  </HeroCardLayout>
)

export default Login
