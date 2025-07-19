import { render, screen } from '@testing-library/react'
import useSessionUser from '@/hooks/useSessionUser'
import useUser from '@/hooks/useUser'
import Message from './Message'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('Message', () => {
  test('renders nothing when sender is null', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useUser>)

    const { container } = render(
      <Message
        senderId="SENDER_ID"
        time="4 minutes ago"
        content="Hello World"
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('renders nothing when user is null', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    const { container } = render(
      <Message
        senderId="SENDER_ID"
        time="4 minutes ago"
        content="Hello World"
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('renders Avatar', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'FEMALE_01',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'FEMALE_01' },
    } as unknown as ReturnType<typeof useUser>)

    render(
      <Message
        senderId="SENDER_ID"
        time="4 minutes ago"
        content="Hello World"
      />
    )

    expect(useUserMock).toHaveBeenCalledWith('SENDER_ID')

    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
  })

  test('renders message', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID_2', displayName: 'Jack', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    render(
      <Message
        senderId="SENDER_ID"
        time="4 minutes ago"
        content="Hello World"
      />
    )

    expect(useUserMock).toHaveBeenCalledWith('SENDER_ID')
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toHaveClass('bg-white')
  })

  test('renders Meta', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    render(
      <Message
        senderId="SENDER_ID"
        time="4 minutes ago"
        content="Hello World"
      />
    )

    expect(useUserMock).toHaveBeenCalledWith('SENDER_ID')
    expect(
      screen.getByRole('contentinfo', { name: 'meta' })
    ).toBeInTheDocument()
  })

  test('renders sender message', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'dog' },
    } as unknown as ReturnType<typeof useUser>)

    render(
      <Message
        senderId="SENDER_ID"
        time="4 minutes ago"
        content="Hello World"
      />
    )

    expect(useUserMock).toHaveBeenCalledWith('SENDER_ID')
    expect(screen.getByRole('region', { name: 'message' })).toHaveClass(
      'flex-row-reverse'
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toHaveClass('ml-auto bg-cyan-200')
  })
})
