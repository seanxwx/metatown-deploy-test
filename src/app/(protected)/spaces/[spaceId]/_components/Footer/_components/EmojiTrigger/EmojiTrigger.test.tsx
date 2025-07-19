import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import { VARIANT } from '@/components/Button'
import broadcastEmojiReaction from '@/db/broadcastEmojiReaction'
import EmojiTrigger from './EmojiTrigger'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/db/broadcastEmojiReaction')
const broadcastEmojiReactionMock = vi.mocked(broadcastEmojiReaction)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

describe('EmojiTrigger', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('does not render the EmojiTrigger if sessionUser is undefined', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'SPACE_NAME' },
    } as unknown as ReturnType<typeof useSpace>)

    const { container } = render(<EmojiTrigger />)

    expect(container).toBeEmptyDOMElement()
  })

  test('does not render the emojiTrigger if cannot get space from spaceID', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({ data: null } as unknown as ReturnType<
      typeof useSpace
    >)

    const { container } = render(<EmojiTrigger />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders the EmojiTrigger', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'spaceId' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'userId' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'SPACE_NAME' },
    } as unknown as ReturnType<typeof useSpace>)

    render(<EmojiTrigger />)

    expect(
      await screen.findByRole('button', { name: 'Emoji' })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Emoji' })).toHaveClass(
      VARIANT.primary
    )
  })

  test('toggles EmojiPicker on EmojiTrigger click', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'spaceId' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'userId' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'SPACE_NAME' },
    } as unknown as ReturnType<typeof useSpace>)

    const user = userEvent.setup()
    render(<EmojiTrigger />)

    expect(
      screen.queryByRole('button', { name: 'Search' })
    ).not.toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Emoji' }))

    expect(
      await screen.findByRole('button', { name: 'Search' })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Emoji' })).toHaveClass(
      VARIANT.secondary
    )

    await user.click(screen.getByRole('button', { name: 'Emoji' }))

    expect(
      screen.queryByRole('button', { name: 'Search' })
    ).not.toBeInTheDocument()
  })

  test('calls broadcastEmojiReaction when an emoji is clicked', async () => {
    const emoji = { label: 'grinning face', unicode: '😀' }

    const spaceId = 'SPACE_ID'
    const userId = 'USER_ID'
    useParamsMock.mockReturnValue({ spaceId })

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'SPACE_NAME' },
    } as unknown as ReturnType<typeof useSpace>)

    const user = userEvent.setup()
    render(<EmojiTrigger />)

    await user.click(await screen.findByRole('button', { name: 'Emoji' }))
    await user.click(screen.getByText(emoji.unicode))

    expect(broadcastEmojiReactionMock).toHaveBeenCalledWith(spaceId, {
      emoji,
      userId,
    })
  })

  test('closes the EmojiPicker when an emoji is clicked and ignoring outside click', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'spaceId' })

    const handleOutsideClick = vi.fn()

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'SPACE_NAME' },
    } as unknown as ReturnType<typeof useSpace>)

    const user = userEvent.setup()
    render(
      <>
        <EmojiTrigger />
        <button onClick={handleOutsideClick}>login</button>
      </>
    )

    await user.click(await screen.findByRole('button', { name: 'Emoji' }))
    await user.click(await screen.findByRole('button', { name: 'login' }))

    expect(handleOutsideClick).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()

    await user.click(screen.getByText('😀'))

    expect(
      screen.queryByRole('button', { name: 'Search' })
    ).not.toBeInTheDocument()
  })
})
