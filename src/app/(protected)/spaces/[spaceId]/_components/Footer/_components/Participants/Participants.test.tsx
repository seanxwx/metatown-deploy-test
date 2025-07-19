import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import useSpace from '@/hooks/useSpace'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import { VARIANT } from '@/components/Button'
import Participants from './Participants'

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useOnlineUsers')
const useOnlineUsersMock = vi.mocked(useOnlineUsers)

describe('Participants', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Button', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Participants onClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Participants' })).toHaveClass(
      VARIANT.underline
    )
  })

  test('calls onClick when participants button is clicked', async () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Participants onClick={handleClick} />)

    await user.click(screen.getByRole('button', { name: 'Participants' }))

    expect(handleClick).toBeCalled()
  })

  test('renders secondary Button with sideWindow open', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {
        id: 'SPACE_ID',
      },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Participants isSideWindowOpen onClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Participants' })).toHaveClass(
      VARIANT.secondary
    )
  })

  test('renders user count', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_ID' }

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: {
        id: space.id,
      },
    } as unknown as ReturnType<typeof useSpace>)

    const onlineUsers = ['USER_ID_1', 'USER_ID_2']

    useOnlineUsersMock.mockReturnValue({
      data: onlineUsers,
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Participants onClick={vi.fn()} />)

    expect(useParams).toHaveBeenCalled()
    expect(useSpace).toBeCalledWith(spaceId)
    expect(useOnlineUsers).toBeCalledWith(space.id)

    expect(screen.getByText(onlineUsers.length)).toBeInTheDocument()
  })

  test('renders default user count if there is no participants', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {
        id: 'SPACE_ID',
      },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Participants onClick={vi.fn()} />)

    expect(screen.getByText(0)).toBeInTheDocument()
  })
})
