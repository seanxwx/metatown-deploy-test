import { FC } from 'react'
import Button from '@/components/Button'
import navigate from '@/utils/navigate'
import useSession from '@/hooks/useSession'

const Actions: FC = () => {
  const { data: session } = useSession(true)

  return (
    <>
      {session?.user ? (
        <Button onClick={() => navigate('/spaces')}>Go To Spaces</Button>
      ) : (
        <div className="flex gap-4">
          <Button
            variant="success"
            onClick={() => navigate('/authentication/sign-up')}
          >
            Get started
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/authentication/login')}
          >
            Sign In
          </Button>
        </div>
      )}
    </>
  )
}

export default Actions
