import { render, screen, within } from '@testing-library/react'
import { useParams } from 'next/navigation'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUser from '@/hooks/useUser'
import useConsume from './_hooks/useConsume'
import Participant from './Participant'

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('./_hooks/useConsume')
const useConsumeMock = vi.mocked(useConsume)

describe('Participant', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  test('renders video, audio, screen and emoji reaction', () => {
    const mediasoupClient = {} as MediasoupClient

    const producers = [
      {
        kind: 'video',
        id: 'VIDEO_ID',
        producerId: 'VIDEO_PRODUCER_ID',
        userId: 'USER_ID',
        state: 'ACTIVE',
      } as const,
      {
        kind: 'audio',
        id: 'AUDIO_ID',
        producerId: 'AUDIO_PRODUCER_ID',
        userId: 'USER_ID',
        state: 'ACTIVE',
      } as const,
      {
        kind: 'screen',
        id: 'SCREEN_ID',
        producerId: 'SCREEN_PRODUCER_ID',
        userId: 'USER_ID',
        state: 'ACTIVE',
      } as const,
    ]

    const audioTrack = { id: 'AUDIO_TRACK_ID' }
    const videoTrack = { id: 'VIDEO_TRACK_ID' }

    const stream = {
      getAudioTracks: vi.fn().mockReturnValue([audioTrack]),
      getVideoTracks: vi.fn().mockReturnValue([videoTrack]),
    } as unknown as MediaStream
    useConsumeMock.mockReturnValue(stream)

    const recorder = {
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
    }

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    const emoji = {
      unicode: '👍',
      label: 'thumbs up',
    }

    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji,
        userId: user.id,
        createdAt: new Date().toISOString(),
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const analyser = {
      getByteTimeDomainData: vi.fn(),
      disconnect: vi.fn(),
    }

    const source = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }

    const audioCtx = {
      createMediaStreamSource: vi.fn().mockReturnValue(source),
      createAnalyser: vi.fn().mockReturnValue(analyser),
      close: vi.fn(),
    } as unknown as AudioContext

    const AudioContext = vi.fn().mockReturnValue(audioCtx)
    vi.stubGlobal('AudioContext', AudioContext)

    const register = {
      video: document.createElement('div'),
      screen: document.createElement('div'),
      audio: document.createElement('div'),
      participant: document.createElement('div'),
    }

    const fragment = document.createDocumentFragment()
    fragment.append(
      register.video,
      register.screen,
      register.audio,
      register.participant
    )

    render(
      <Participant
        onSpeak={vi.fn()}
        producers={producers}
        userId="USER_ID"
        mediasoupClient={mediasoupClient}
        register={register}
        recorder={recorder}
      />,
      { container: document.body.appendChild(fragment) }
    )

    expect(useConsume).toHaveBeenCalledWith(
      mediasoupClient,
      'VIDEO_PRODUCER_ID'
    )

    expect(
      within(register.audio).getByText(user.displayName)
    ).toBeInTheDocument()

    expect(useConsume).toHaveBeenCalledWith(
      mediasoupClient,
      'AUDIO_PRODUCER_ID'
    )

    expect(
      within(register.video).getByLabelText('Video Feed')
    ).toBeInTheDocument()

    expect(useConsume).toHaveBeenCalledWith(
      mediasoupClient,
      'SCREEN_PRODUCER_ID'
    )

    expect(
      within(register.screen).getByText(`${user.displayName} is Sharing`)
    ).toBeInTheDocument()

    expect(
      within(register.participant).getByText(emoji.unicode)
    ).toBeInTheDocument()

    expect(recorder.addTrack).toHaveBeenCalledWith(audioTrack)
    expect(recorder.addTrack).toHaveBeenCalledWith(videoTrack)

    vi.useRealTimers()
  })

  test('does not render emoji reaction if no registered participant portal', () => {
    const mediasoupClient = {} as MediasoupClient

    const stream = {} as MediaStream
    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    const emoji = {
      unicode: '👍',
      label: 'thumbs up',
    }

    useEmojiReactionMock.mockReturnValue({
      data: {
        emoji,
        userId: user.id,
      },
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const analyser = {
      getByteTimeDomainData: vi.fn(),
      disconnect: vi.fn(),
    }

    const source = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }

    const audioCtx = {
      createMediaStreamSource: vi.fn().mockReturnValue(source),
      createAnalyser: vi.fn().mockReturnValue(analyser),
      close: vi.fn(),
    } as unknown as AudioContext

    const AudioContext = vi.fn().mockReturnValue(audioCtx)
    vi.stubGlobal('AudioContext', AudioContext)

    const register = {
      video: document.createElement('div'),
      screen: document.createElement('div'),
      audio: document.createElement('div'),
      participant: null,
    }

    const fragment = document.createDocumentFragment()
    fragment.append(register.video, register.screen, register.audio)

    render(
      <Participant
        onSpeak={vi.fn()}
        producers={[]}
        userId="USER_ID"
        mediasoupClient={mediasoupClient}
        register={register}
      />,
      { container: document.body.appendChild(fragment) }
    )

    expect(screen.queryByText(emoji.unicode)).not.toBeInTheDocument()
  })
})
