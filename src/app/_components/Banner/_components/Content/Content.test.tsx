import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import navigate from '@/utils/navigate'
import Content from './Content'

vi.mock('@/utils/navigate')

describe('Content', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders header and features', async () => {
    render(<Content />)

    expect(
      screen.getByText(
        "Australia's Original Online Interactive Learning Platform"
      )
    ).toBeInTheDocument()
    expect(await screen.findAllByLabelText('CircleCheck')).toHaveLength(3)
    expect(
      screen.getByText('Immersive teaching experience')
    ).toBeInTheDocument()
  })

  test('navigates to the sign up page when click get started button', async () => {
    const user = userEvent.setup()

    render(<Content />)

    expect(
      screen.getByRole('button', { name: 'Get started' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Get started' }))
    expect(navigate).toHaveBeenCalledWith('/authentication/sign-up')
  })
})
