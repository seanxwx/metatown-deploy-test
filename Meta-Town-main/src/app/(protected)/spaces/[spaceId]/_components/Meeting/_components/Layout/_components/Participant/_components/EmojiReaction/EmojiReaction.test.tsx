import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useUser from '@/hooks/useUser'
import useSpace from '@/hooks/useSpace'
import EmojiReaction from './EmojiReaction'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

describe('EmojiReaction', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('does not render EmojiReaction when cannot get the space', () => {
    vi.useFakeTimers()
    const userId = 'userId'
    const spaceId = 'spaceId'
    useParamsMock.mockReturnValue({ spaceId })

    useSpaceMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSpace>)

    useUserMock.mockReturnValue({
      data: { id: userId, displayName: 'Jason Wu' },
    } as unknown as ReturnType<typeof useUser>)

    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji: {
          unicode: '👍',
          label: 'thumbs up',
        },
        userId,
        createdAt: new Date().toISOString(),
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const { container } = render(<EmojiReaction userId={userId} />)

    expect(container).toBeEmptyDOMElement()
    vi.useRealTimers()
  })

  test('renders the EmojiReaction when userId matches', async () => {
    vi.useFakeTimers()
    const userId = 'userId'
    const spaceId = 'spaceId'

    const emoji = {
      unicode: '👍',
      label: 'thumbs up',
    }

    const user = { id: userId, displayName: 'Jason Wu' }
    useParamsMock.mockReturnValue({ spaceId })

    useSpaceMock.mockReturnValue({
      data: {
        id: spaceId,
      },
    } as unknown as ReturnType<typeof useSpace>)

    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji,
        userId,
        createdAt: new Date().toISOString(),
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useUser>)

    render(<EmojiReaction userId={userId} />)

    expect(useEmojiReactionMock).toBeCalledWith(spaceId)

    expect(
      await screen.findByRole('img', { name: 'thumbs up from Jason Wu' })
    ).toBeInTheDocument()

    expect(screen.getByText(emoji.unicode)).toBeInTheDocument()
    vi.useRealTimers()
  })

  test('does not render the EmojiReaction if userId does not match', () => {
    vi.useFakeTimers()
    const spaceId = 'spaceId'
    const userId = 'userId'
    useParamsMock.mockReturnValue({ spaceId: 'spaceId' })

    useSpaceMock.mockReturnValue({
      data: {
        id: spaceId,
      },
    } as unknown as ReturnType<typeof useSpace>)

    useUserMock.mockReturnValue({
      data: { id: userId, displayName: 'Jason Wu' },
    } as unknown as ReturnType<typeof useUser>)

    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji: {
          unicode: '👍',
          label: 'thumbs up',
        },
        userId: 'otherUserId',
        createdAt: new Date().toISOString(),
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const { container } = render(<EmojiReaction userId={userId} />)
    expect(container).toBeEmptyDOMElement()
    vi.useRealTimers()
  })

  test('does not render the EmojiReaction when there is no emoji reaction data', () => {
    const spaceId = 'spaceId'
    const userId = 'userId'
    useParamsMock.mockReturnValue({ spaceId })

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    useUserMock.mockReturnValue({
      data: { id: userId, displayName: 'Jason Wu' },
    } as unknown as ReturnType<typeof useUser>)

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const { container } = render(<EmojiReaction userId={userId} />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders the EmojiReaction and removes it after 3 seconds', async () => {
    vi.useFakeTimers()
    const userId = 'userId'
    const spaceId = 'spaceId'
    const unicode = '👍'

    const emoji = {
      unicode: '👍',
      label: 'thumbs up',
    }

    const user = {
      id: userId,
      displayName: 'Jason Wu',
    }
    useParamsMock.mockReturnValue({ spaceId })
    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji,
        userId,
        createdAt: new Date().toISOString(),
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    useUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useUser>)

    render(<EmojiReaction userId="userId" />)
    expect(
      await screen.findByRole('img', {
        name: `${emoji.label} from ${user.displayName}`,
      })
    ).toBeInTheDocument()

    expect(screen.getByText(unicode)).toBeInTheDocument()

    await act(() => vi.advanceTimersByTime(3000))

    expect(
      screen.queryByRole('img', {
        name: `${emoji.label} from ${user.displayName}`,
      })
    ).not.toBeInTheDocument()

    expect(screen.queryByText(unicode)).not.toBeInTheDocument()

    vi.useRealTimers()
  })

  test('does not render the EmojiReaction if the emoji reaction data is older than 3 seconds', () => {
    vi.useFakeTimers()
    const userId = 'userId'
    const spaceId = 'spaceId'

    const emoji = {
      unicode: '👍',
      label: 'thumbs up',
    }

    const user = {
      id: userId,
      displayName: 'Jason Wu',
    }
    useParamsMock.mockReturnValue({ spaceId })
    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji,
        userId,
        createdAt: new Date(Date.now() - 3001).toISOString(),
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    useUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useUser>)

    const { container } = render(<EmojiReaction userId={userId} />)

    expect(container).toBeEmptyDOMElement()
    vi.useRealTimers()
  })
})
