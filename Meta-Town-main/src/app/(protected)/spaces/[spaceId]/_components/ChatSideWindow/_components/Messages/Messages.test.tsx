import { render, screen, within } from '@testing-library/react'
import { useParams } from 'next/navigation'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useMessages from '@/hooks/useMessages'
import useUser from '@/hooks/useUser'
import Messages from './Messages'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useMessages')
const useMessagesMock = vi.mocked(useMessages)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('Messages', () => {
  test('renders loading when messages are still loading', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useMessagesMock.mockReturnValue({
      isLoading: true,
      data: null,
    } as unknown as ReturnType<typeof useMessages>)

    render(<Messages />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  test('renders nothing when messages are null', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: null,
    } as unknown as ReturnType<typeof useMessages>)

    const { container } = render(<Messages />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders messages', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'MALE_01' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    const data = [
      {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        },
        createdAt: new Date(Date.now() - 30000),
        id: 'ID',
        senderId: 'SENDER_ID',
      },
    ]

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data,
    } as unknown as ReturnType<typeof useMessages>)

    render(<Messages />)

    expect(useUserMock).toHaveBeenCalledWith('SENDER_ID')

    expect(screen.getByRole('region', { name: 'messages' })).toBeInTheDocument()

    expect(screen.getAllByRole('region', { name: 'message' })).toHaveLength(
      data.length
    )

    expect(
      within(screen.getByRole('region', { name: 'message' })).getByText(
        data[0].content.content[0].content[0].text
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('region', { name: 'message' })).getByText(
        'a few seconds ago'
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByRole('region', { name: 'message' })).getByRole('img', {
        name: 'John Doe',
      })
    ).toBeInTheDocument()
  })

  test('scrolls to bottom when a new message arrives', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserMock.mockReturnValue({
      data: { id: 'ID', displayName: 'John Doe', avatar: 'MALE_01' },
    } as unknown as ReturnType<typeof useUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    const data = [
      {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        },
        createdAt: new Date(Date.now() - 30000),
        id: 'ID',
        senderId: 'SENDER_ID',
      },
    ]

    const scrollToBottom = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollToBottom

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data,
    } as unknown as ReturnType<typeof useMessages>)

    render(<Messages />)

    expect(scrollToBottom).toHaveBeenCalled()
  })
})
