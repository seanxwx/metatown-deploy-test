import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import { Movement } from '@/app/types'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useSpace from '@/hooks/useSpace'
import useUser from '@/hooks/useUser'
import Character from './Character'
import useDrawCharacterCanvas from './_hooks/useDrawCharacterCanvas'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('./_hooks/useDrawCharacterCanvas')

describe('Character', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders canvas with drawn character', () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({ spaceId })

    const userId = 'USER_ID'

    const user = {
      id: userId,
      displayName: 'Test User',
      avatar: 'FEMALE_01',
    }
    useUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useUser>)

    const emojiReaction = {
      emoji: { label: 'Thumbs Up', unicode: '👍' },
      userId: 'USER_ID',
    }
    useEmojiReactionMock.mockReturnValue({
      data: emojiReaction,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const space = { id: spaceId, name: 'Test Space' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const movement: Movement = {
      x: 5,
      y: 10,
      direction: 'N',
      isMoving: false,
    }

    const canvasConfig = {
      zoom: 1,
      cameraOffset: { top: 0, left: 0 },
    }

    const { rerender } = render(
      <Character
        userId={userId}
        movement={movement}
        canvasConfig={canvasConfig}
      />
    )

    expect(useUser).toHaveBeenCalledWith(userId)

    expect(useSpace).toHaveBeenCalledWith(spaceId)

    expect(useEmojiReaction).toHaveBeenCalledWith(space.id)

    expect(screen.getByLabelText('Character Canvas')).toBeInTheDocument()

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(null, canvasConfig, {
      user,
      movement,
      emojiReaction,
    })

    rerender(
      <Character
        userId={userId}
        movement={movement}
        canvasConfig={canvasConfig}
      />
    )

    expect(useDrawCharacterCanvas).toHaveBeenCalledWith(
      screen.getByLabelText('Character Canvas'),
      canvasConfig,
      {
        user,
        movement,
        emojiReaction,
      }
    )
  })
})
