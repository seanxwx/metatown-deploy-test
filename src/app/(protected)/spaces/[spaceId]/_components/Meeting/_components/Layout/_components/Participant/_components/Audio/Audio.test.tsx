import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useSessionUser from '@/hooks/useSessionUser'
import useUser from '@/hooks/useUser'
import updateProducer from '@/db/updateProducer'
import useConsume from '../../_hooks/useConsume'
import useVolume from './_hooks/useVolume'
import Audio, { ACTIVE, THRESHOLD } from './Audio'

vi.mock('./_hooks/useVolume')
const useVolumeMock = vi.mocked(useVolume)

vi.mock('../../_hooks/useConsume')
const useConsumeMock = vi.mocked(useConsume)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/db/updateProducer')

describe('Audio', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders audio', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    const userId = 'USER_ID'
    const user = { id: userId, displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const portal = document.createElement('div')

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId={userId}
        portal={portal}
        onSpeak={vi.fn()}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(
      mediasoupClient,
      producer.producerId
    )
    expect(useVolume).toHaveBeenCalledWith(stream)
    expect(screen.getByLabelText('Video Feed')).toBeInTheDocument()

    expect(
      screen.getByLabelText<HTMLVideoElement>('Video Feed').srcObject
    ).toBe(stream)

    expect(screen.getByLabelText<HTMLVideoElement>('Video Feed').muted).toBe(
      false
    )

    expect(useUser).toHaveBeenCalledWith(userId)

    expect(screen.getByText(user.displayName)).toBeInTheDocument()
    expect(screen.getByLabelText('Unmuted')).toBeInTheDocument()
  })

  test('renders muted audio when session user is the producer', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    const userId = 'USER_ID'
    const user = { id: userId, displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as ReturnType<typeof useSessionUser>)

    const portal = document.createElement('div')

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId={userId}
        portal={portal}
        onSpeak={vi.fn()}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(
      mediasoupClient,
      producer.producerId
    )

    expect(screen.getByLabelText('Video Feed')).toBeInTheDocument()

    expect(
      screen.getByLabelText<HTMLVideoElement>('Video Feed').srcObject
    ).toBe(stream)

    expect(screen.getByLabelText<HTMLVideoElement>('Video Feed').muted).toBe(
      true
    )

    expect(useUser).toHaveBeenCalledWith(userId)

    expect(screen.getByText(user.displayName)).toBeInTheDocument()
    expect(screen.getByLabelText('Unmuted')).toBeInTheDocument()
  })

  test('calls useConsume with null producerId when state is PAUSED', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'PAUSED',
    } as const

    useConsumeMock.mockReturnValue(null)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const portal = document.createElement('div')

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(mediasoupClient, null)
  })

  test('calls useConsume with null producerId when producer is not provided', () => {
    const mediasoupClient = {} as MediasoupClient

    useConsumeMock.mockReturnValue(null)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const portal = document.createElement('div')

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(mediasoupClient, null)
  })

  test('does not render video when useConsume returns null', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(null)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const portal = document.createElement('div')

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()

    expect(screen.getByText(user.displayName)).toBeInTheDocument()
    expect(screen.getByLabelText('Muted')).toBeInTheDocument()
  })

  test('does not render UserInfo and Mute button when portal is null', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={null}
        onSpeak={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Video Feed')).toBeInTheDocument()

    expect(screen.queryByText(user.displayName)).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Mute' })
    ).not.toBeInTheDocument()
  })

  test('adds classes when volume is above threshold', () => {
    const stream = {} as MediaStream
    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    useVolumeMock.mockReturnValue(THRESHOLD + 0.01)

    const portal = document.createElement('div')

    const mediasoupClient = {} as MediasoupClient

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />
    )

    expect(portal).toHaveClass(...ACTIVE)
  })

  test('does not add classes if volume is less than threshold', () => {
    const stream = {} as MediaStream
    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    useVolumeMock.mockReturnValue(THRESHOLD - 0.01)

    const portal = document.createElement('div')

    const mediasoupClient = {} as MediasoupClient

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />
    )

    expect(portal).not.toHaveClass(...ACTIVE)
  })

  test('removes ring classes on cleanup', () => {
    const stream = {} as MediaStream
    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    useVolumeMock.mockReturnValue(THRESHOLD + 0.01)

    const portal = document.createElement('div')

    const mediasoupClient = {} as MediasoupClient

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    const { unmount } = render(
      <Audio
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />
    )

    expect(portal).toHaveClass(...ACTIVE)

    unmount()

    expect(portal).not.toHaveClass(...ACTIVE)
  })

  test('calls onSpeak when volume is above threshold', () => {
    useConsumeMock.mockReturnValue({} as MediaStream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }
    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const onSpeak = vi.fn()

    useVolumeMock.mockReturnValue(THRESHOLD + 0.01)

    render(
      <Audio
        mediasoupClient={{} as MediasoupClient}
        producer={{
          id: 'ID',
          producerId: 'PRODUCER_ID',
          state: 'ACTIVE',
        }}
        userId="USER_ID"
        portal={document.createElement('div')}
        onSpeak={onSpeak}
      />
    )

    expect(onSpeak).toHaveBeenCalledWith(user.id)
  })

  test('calls update producer when click the mute audio button', async () => {
    useConsumeMock.mockReturnValue({} as MediaStream)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const producer = {
      id: 'ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE' as const,
    }

    const portal = document.createElement('div')

    const user = userEvent.setup()

    render(
      <Audio
        mediasoupClient={{} as MediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
        onSpeak={vi.fn()}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(portal).toHaveClass('group/audio')

    expect(
      await screen.findByRole('button', { name: 'Mute' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mute' }))

    expect(updateProducer).toHaveBeenCalledWith(producer.id, {
      state: 'PAUSED',
    })
  })

  test('records audio', () => {
    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const recorder = {
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
    }

    const track = { id: 'AUDIO_TRACK_ID' }

    const mediaStream = {
      getAudioTracks: vi.fn().mockReturnValue([track]),
    } as unknown as MediaStream

    useConsumeMock.mockReturnValue(mediaStream)

    const { unmount } = render(
      <Audio
        mediasoupClient={{} as MediasoupClient}
        userId="USER_ID"
        portal={document.createElement('div')}
        onSpeak={vi.fn()}
        recorder={recorder}
      />
    )

    expect(recorder.addTrack).toHaveBeenCalledWith(track)

    unmount()

    expect(recorder.removeTrack).toHaveBeenCalledWith(track)
  })

  test('does not record audio when no audio track is available', () => {
    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as ReturnType<typeof useSessionUser>)

    const recorder = {
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
    }

    useConsumeMock.mockReturnValue(null)

    render(
      <Audio
        mediasoupClient={{} as MediasoupClient}
        userId="USER_ID"
        portal={document.createElement('div')}
        onSpeak={vi.fn()}
        recorder={recorder}
      />
    )

    expect(recorder.addTrack).not.toHaveBeenCalled()
  })
})
