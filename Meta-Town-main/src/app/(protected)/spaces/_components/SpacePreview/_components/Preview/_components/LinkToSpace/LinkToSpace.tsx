import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { LogIn } from 'lucide-react'

interface Props {
  spaceID: string
  children: ReactNode
}

const LinkToSpace: FC<Props> = ({ spaceID, children }) => (
  <Link
    href={`/spaces/${spaceID}`}
    className="group relative block cursor-pointer rounded-2xl border-4 bg-gray-200 hover:border-gray-300"
  >
    {children}

    <div className="absolute inset-0 flex items-center justify-center">
      <div
        role="presentation"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        <LogIn
          size={25}
          color="white"
          strokeWidth={3}
          aria-label="Enter this space"
        />
      </div>
    </div>
  </Link>
)

export default LinkToSpace
