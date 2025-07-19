import { redirect } from 'next/navigation'
import navigate from './navigate'

vi.mock('next/navigation')

describe('navigate', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('redirects to /authentication/login', () => {
    navigate('/authentication/login')

    expect(redirect).toHaveBeenCalledWith('/authentication/login')
  })
})
