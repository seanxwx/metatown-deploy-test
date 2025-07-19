import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Contact, UserPlus } from 'lucide-react'
import Button from '@/components/Button'
import SideWindow from './SideWindow'

describe('SideWindow', () => {
  test('renders side window', async () => {
    const onClick = vi.fn()

    const user = userEvent.setup()

    render(
      <SideWindow
        label="Side Window"
        onClose={onClick}
        header={
          <>
            <span>Participants</span>
            <div className="flex">
              <Button>
                <UserPlus aria-label="Add user" />
              </Button>
              <Button>
                <Contact aria-label="Contact" />
              </Button>
            </div>
          </>
        }
      >
        Content
      </SideWindow>
    )

    expect(
      screen.getByRole('region', { name: 'Side Window' })
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('region', { name: 'Side Window' })).getByText(
        'Content'
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('region', { name: 'Side Window' })).getByText(
        'Participants'
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('region', { name: 'Side Window' })).getByRole(
        'button',
        { name: 'Add user' }
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('region', { name: 'Side Window' })).getByRole(
        'button',
        { name: 'Contact' }
      )
    ).toBeInTheDocument()

    expect(
      await within(
        screen.getByRole('region', { name: 'Side Window' })
      ).findByRole('button', { name: 'Close' })
    ).toBeInTheDocument()

    await user.click(
      within(screen.getByRole('region', { name: 'Side Window' })).getByRole(
        'button',
        { name: 'Close' }
      )
    )

    expect(onClick).toHaveBeenCalled()
  })
})
