import { render, screen, within } from '@testing-library/react'
import useUser from '@/hooks/useUser'
import Participant, { STATUS } from './Participant'

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('Participant', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Participant', () => {
    const userId = 'USER_ID1'
    const displayName = 'Alice'

    useUserMock.mockReturnValue({
      data: {
        id: '1',
        displayName,
        avatar: 'FEMALE_01',
      },
    } as unknown as ReturnType<typeof useUser>)

    render(<Participant userId={userId} status="ONLINE" />)

    expect(useUser).toHaveBeenCalledWith(userId)

    expect(screen.getByRole('img', { name: displayName })).toBeInTheDocument()

    expect(
      within(screen.getByRole('group', { name: 'User presence' })).getByText(
        displayName
      )
    ).toBeInTheDocument()
  })

  test('does not render participant if there is no user record', () => {
    useUserMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useUser>)

    const { container } = render(
      <Participant userId="USER_ID" status="ONLINE" />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('renders opacity of 0.5 if participant is offline', () => {
    const user = { displayName: 'Alice' }

    useUserMock.mockReturnValue({
      data: {
        id: '1',
        displayName: user.displayName,
        avatar: 'bird',
      },
    } as unknown as ReturnType<typeof useUser>)

    render(<Participant userId="USER_ID" status="OFFLINE" />)

    expect(screen.getByRole('presentation')).toHaveClass('opacity-50')
  })

  test.each(['ONLINE', 'OFFLINE'] as const)(
    'renders status of %s participant',
    (status) => {
      const user = { displayName: 'Alice' }

      useUserMock.mockReturnValue({
        data: {
          id: '1',
          displayName: user.displayName,
          avatar: 'bird',
        },
      } as unknown as ReturnType<typeof useUser>)

      render(<Participant userId="USER_ID1" status={status} />)

      expect(
        screen.getByLabelText(`${user.displayName}'s Status: ${status}`)
      ).toHaveClass(STATUS[status])
    }
  )
})
