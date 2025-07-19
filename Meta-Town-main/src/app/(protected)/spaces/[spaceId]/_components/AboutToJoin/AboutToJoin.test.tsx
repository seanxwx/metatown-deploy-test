import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AboutToJoin from './AboutToJoin'

describe('AboutToJoin', () => {
  test('renders title with space name', () => {
    render(<AboutToJoin onClick={vi.fn()} spaceName="Mars" />)

    expect(screen.getByText("You're about to join - Mars")).toBeInTheDocument()
  })

  test('calls onClick when the button is clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<AboutToJoin onClick={onClick} spaceName="Mars" />)

    await user.click(screen.getByRole('button', { name: 'Join space' }))

    expect(onClick).toBeCalled()
  })
})
