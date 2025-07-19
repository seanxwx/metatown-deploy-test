import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useMessages from '@/hooks/useMessages'
import useUser from '@/hooks/useUser'
import ChatSideWindow from './ChatSideWindow'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useMessages')
const useMessagesMock = vi.mocked(useMessages)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('@tiptap/core')

describe('ChatSideWindow', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders header', () => {
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

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          content: 'Hello World',
          createdAt: '2021-01-01T00:00:00.000Z',
          id: 'ID',
          senderId: 'SENDER_ID',
        },
      ],
    } as unknown as ReturnType<typeof useMessages>)

    render(<ChatSideWindow onClose={vi.fn()} />)

    expect(screen.getByText('Chat')).toBeInTheDocument()
  })

  test('renders Messages', () => {
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
              content: [
                {
                  type: 'text',
                  text: 'Hello World!',
                },
              ],
            },
          ],
        },
        created_at: '2021-01-01T00:00:00.000Z',
        id: 'ID',
        sender_id: 'SENDER_ID',
      },
    ]

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data,
    } as unknown as ReturnType<typeof useMessagesMock>)

    render(<ChatSideWindow onClose={vi.fn()} />)

    expect(
      within(screen.getByRole('region', { name: 'message' })).getByRole('img', {
        name: 'John Doe',
      })
    ).toBeInTheDocument()
  })

  test('renders Form', async () => {
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

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello world!',
                  },
                ],
              },
            ],
          },
          createdAt: '2021-01-01T00:00:00.000Z',
          id: 'ID',
          senderId: 'SENDER_ID',
        },
      ],
    } as unknown as ReturnType<typeof useMessages>)

    render(<ChatSideWindow onClose={vi.fn()} />)

    expect(
      await screen.findByRole('button', { name: 'Send' })
    ).toBeInTheDocument()
  })

  test('renders side window', () => {
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

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello world!',
                  },
                ],
              },
            ],
          },
          createdAt: '2021-01-01T00:00:00.000Z',
          id: 'ID',
          senderId: 'SENDER_ID',
        },
      ],
    } as unknown as ReturnType<typeof useMessages>)

    render(<ChatSideWindow onClose={vi.fn()} />)

    expect(
      screen.getByRole('region', { name: 'Chat Side Window' })
    ).toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', async () => {
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

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useMessagesMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello world!',
                  },
                ],
              },
            ],
          },
          createdAt: '2021-01-01T00:00:00.000Z',
          id: 'ID',
          senderId: 'SENDER_ID',
        },
      ],
    } as unknown as ReturnType<typeof useMessages>)

    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<ChatSideWindow onClose={handleClick} />)

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(handleClick).toBeCalled()
  })
})
