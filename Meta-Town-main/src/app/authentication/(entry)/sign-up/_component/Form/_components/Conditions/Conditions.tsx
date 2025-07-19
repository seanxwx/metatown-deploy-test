import { FC } from 'react'
import Link from 'next/link'

const Conditions: FC = () => (
  <div className="text-sm/6 text-neutral-500 lg:text-base">
    <p className="mb-2">
      By signing up, you agree to our: &nbsp;
      <Link className="underline" href="/">
        Terms &
        <span className="lg:hidden">
          <br />
        </span>
        Conditions
      </Link>
      &nbsp; and &nbsp;
      <span className="hidden lg:inline">
        <br />
      </span>
      <Link className="underline" href="/">
        Privacy Policy
      </Link>
    </p>
  </div>
)

export default Conditions
