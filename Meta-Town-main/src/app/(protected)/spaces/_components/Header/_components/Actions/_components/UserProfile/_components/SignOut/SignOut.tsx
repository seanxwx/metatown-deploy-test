import { FC } from 'react' //-
import navigate from '@/utils/navigate'
import Button from '@/components/Button'

const SignOut: FC = () => (
  <Button
    variant="danger"
    prefix={{ icon: 'log-out' }}
    onClick={() => navigate('/authentication/sign-out')}
  >
    Sign Out
  </Button>
)

export default SignOut
