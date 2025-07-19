import { act, render, screen, waitFor } from '@testing-library/react'
import { IconName } from 'lucide-react/dynamic'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { VARIANT } from '@/components/Button'
import upsertProducer from '@/db/upsertProducer'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import deleteProducer from '@/db/deleteProducer'
import useProducers from '@/hooks/useProducers'
import useMedia from './_hooks/useMedia'
import Media from './Media'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/db/upsertProducer')
const upsertProducerMock = vi.mocked(upsertProducer)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('./_hooks/useMedia')
const useMediaMock = vi.mocked(useMedia)

vi.mock('@/hooks/useProducers')
const useProducersMock = vi.mocked(useProducers)

vi.mock('@/db/deleteProducer')

describe('Media', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  test('deletes producer when user stops sharing screen', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    const user = userEvent.setup()
    const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    const addEventListener =
      vi.fn<(event: string, callback: () => void) => void>()

    const track = {
      kind: 'screen',
      addEventListener,
    }

    const stream = {
      getTracks: () => [track],
    } as unknown as MediaStream
    const requestMediaStream = vi.fn().mockResolvedValue(stream)
    const releaseMediaStream = vi.fn()

    useMediaMock.mockReturnValue({
      requestMediaStream,
      releaseMediaStream,
    })

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'screen-share' as IconName, label: 'Stop Screen Share' }
        : { name: 'screen-share-off' as IconName, label: 'Start Screen Share' }
    )

    render(
      <Media
        mediasoupClient={mediasoupClient}
        icon={icon}
        label="screen"
        kind="screen"
      />
    )

    await user.click(
      await screen.findByRole('button', { name: 'Start Screen Share' })
    )

    const { calls } = track.addEventListener.mock

    expect(calls[0][0]).toBe('ended')

    act(() => {
      calls[0][1]()
    })

    await waitFor(() => {
      expect(deleteProducer).toHaveBeenCalledWith(producer.id)
    })
  })

  test('renders null when no space is provided', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useMediaMock.mockReturnValue({
      requestMediaStream: vi.fn(),
      releaseMediaStream: vi.fn(),
    })

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'video' as IconName, label: 'Turn Off Camera' }
        : { name: 'video-off' as IconName, label: 'Turn On Camera' }
    )

    const { container } = render(
      <Media
        icon={icon}
        label="video"
        kind="video"
        mediasoupClient={{
          produce: vi.fn(),
          consume: vi.fn(),
        }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test('renders null when no session user is provided', () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSessionUser>)

    useMediaMock.mockReturnValue({
      requestMediaStream: vi.fn(),
      releaseMediaStream: vi.fn(),
    })

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'video' as IconName, label: 'Turn Off Camera' }
        : { name: 'video-off' as IconName, label: 'Turn On Camera' }
    )

    const { container } = render(
      <Media
        icon={icon}
        label="video"
        kind="video"
        mediasoupClient={{
          produce: vi.fn(),
          consume: vi.fn(),
        }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test('does not render video feed when start receives null stream', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    const requestMediaStream = vi.fn().mockResolvedValue(null)
    useMediaMock.mockReturnValue({
      requestMediaStream,
      releaseMediaStream: vi.fn(),
    })

    const user = userEvent.setup()

    const mediasoupClient = {
      produce: vi.fn(),
      consume: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'video' as IconName, label: 'Turn Off Camera' }
        : { name: 'video-off' as IconName, label: 'Turn On Camera' }
    )

    render(
      <Media
        mediasoupClient={mediasoupClient}
        icon={icon}
        label="video"
        kind="video"
      />
    )

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()

    expect(
      screen.queryByRole('status', { name: 'Loading' })
    ).not.toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toHaveClass(VARIANT.danger)

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).not.toBeDisabled()

    expect(requestMediaStream).toHaveBeenCalled()
  })

  test('does not render video feed when resume receives null video stream when kind is video', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    upsertProducerMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    const track = {
      kind: 'video',
      addEventListener: vi.fn(),
    } as unknown as MediaStreamTrack

    const stream = {
      getTracks: () => [track],
    } as unknown as MediaStream

    const requestMediaStream = vi.fn().mockResolvedValue(stream)
    useMediaMock.mockReturnValue({
      requestMediaStream,
      releaseMediaStream: vi.fn(),
    })

    const producer = { id: 'PRODUCER_ID' }

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    const user = userEvent.setup()

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'video' as IconName, label: 'Turn Off Camera' }
        : { name: 'video-off' as IconName, label: 'Turn On Camera' }
    )

    render(
      <Media
        mediasoupClient={mediasoupClient}
        icon={icon}
        label="video"
        kind="video"
      />
    )

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    )

    expect(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    ).toHaveClass(VARIANT.success)

    await user.click(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    )

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toHaveClass(VARIANT.danger)

    requestMediaStream.mockResolvedValue(null)

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()

    expect(
      screen.queryByRole('status', { name: 'Loading' })
    ).not.toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toHaveClass(VARIANT.danger)

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).not.toBeDisabled()

    expect(requestMediaStream).toHaveBeenCalledTimes(2)
  })

  test('renders video feed correctly when toggles the video button', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    const space = { id: 'SPACE_ID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const sessionUser = { id: 'USER_ID' }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    upsertProducerMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    const track = {
      kind: 'video',
      addEventListener: vi.fn(),
    } as unknown as MediaStreamTrack

    const stream = {
      getTracks: () => [track],
    } as unknown as MediaStream
    const requestMediaStream = vi.fn().mockResolvedValue(stream)
    const releaseMediaStream = vi.fn()

    useMediaMock.mockReturnValue({
      requestMediaStream,
      releaseMediaStream,
    })

    const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

    const user = userEvent.setup()

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'video' as IconName, label: 'Turn Off Camera' }
        : { name: 'video-off' as IconName, label: 'Turn On Camera' }
    )

    render(
      <Media
        mediasoupClient={mediasoupClient}
        icon={icon}
        label="video"
        kind="video"
      />
    )

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    )
    expect(await screen.findByLabelText('Video Feed')).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    ).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    )

    expect(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    ).toBeDisabled()

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toBeInTheDocument()

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()

    expect(
      screen.queryByRole('status', { name: 'Loading' })
    ).not.toBeInTheDocument()

    expect(releaseMediaStream).toHaveBeenCalledWith(stream)

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    )

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toBeDisabled()

    expect(await screen.findByLabelText('Video Feed')).toBeInTheDocument()

    expect(
      screen.getByLabelText<HTMLVideoElement>('Video Feed').srcObject
    ).toBe(stream)

    expect(producer.replaceStream).toHaveBeenCalledWith(stream)
  })

  test('sets the stream to null when the producer is paused', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    const space = { id: 'SPACE_ID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const sessionUser = { id: 'USER_ID' }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    upsertProducerMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    const track = {
      kind: 'audio',
      addEventListener: vi.fn(),
    } as unknown as MediaStreamTrack

    const stream = {
      getTracks: () => [track],
    } as unknown as MediaStream
    const requestMediaStream = vi.fn().mockResolvedValue(stream)
    const releaseMediaStream = vi.fn()

    useMediaMock.mockReturnValue({
      requestMediaStream,
      releaseMediaStream,
    })

    const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    const user = userEvent.setup()

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    const icon = vi.fn((isStreaming) =>
      isStreaming
        ? { name: 'play' as IconName, label: `Turn Off Microphone` }
        : { name: 'pause' as IconName, label: `Turn On Microphone` }
    )

    const { rerender } = render(
      <Media
        mediasoupClient={mediasoupClient}
        icon={icon}
        label="Microphone"
        kind="audio"
      />
    )

    await user.click(
      await screen.findByRole('button', { name: `Turn On Microphone` })
    )

    expect(
      await screen.findByRole('button', { name: `Turn Off Microphone` })
    ).toHaveClass(VARIANT.success)

    useProducersMock.mockReturnValue({
      data: [
        {
          producerId: producer.id,
          state: 'PAUSED',
        },
      ],
    } as unknown as ReturnType<typeof useProducers>)

    rerender(
      <Media
        mediasoupClient={mediasoupClient}
        icon={icon}
        label="Microphone"
        kind="audio"
      />
    )

    expect(
      await screen.findByRole('button', { name: `Turn On Microphone` })
    ).toHaveClass(VARIANT.danger)
  })

  test.each(['video', 'audio'] as const)(
    'renders dropdown panel when configuration button is clicked',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      const KIND_LABEL = {
        video: 'camera',
        audio: 'microphone',
      } as const

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      upsertProducerMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      )

      const stream = {} as MediaStream
      const requestMediaStream = vi.fn().mockResolvedValue(stream)
      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream: vi.fn(),
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))

      expect(screen.getByText(`Select ${KIND_LABEL[kind]}`)).toBeInTheDocument()
    }
  )

  test.each(['video', 'audio'] as const)(
    'selects device by clicking device button',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      const deviceId = 'DEVICE_ID'

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      upsertProducerMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      )

      const stream = {} as MediaStream
      const requestMediaStream = vi.fn().mockResolvedValue(stream)
      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream: vi.fn(),
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([
            kind === 'video'
              ? ({
                  deviceId,
                  kind: 'videoinput',
                  label: kind,
                  groupId: 'GROUP_ID',
                } as MediaDeviceInfo)
              : ({
                  deviceId,
                  kind: 'audioinput',
                  label: kind,
                  groupId: 'GROUP_ID',
                } as MediaDeviceInfo),
          ]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(screen.getByRole('button', { name: kind }))

      await user.click(screen.getByRole('button', { name: `Turn On ${kind}` }))

      expect(requestMediaStream).toHaveBeenCalledWith(deviceId)
    }
  )

  test.each(['video', 'screen', 'audio'] as const)(
    'toggles %s stream on click with created stream and kind is %s',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      upsertProducerMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      )

      const track = {
        kind,
        addEventListener: vi.fn(),
      } as unknown as MediaStreamTrack

      const stream = {
        getTracks: () => [track],
      } as unknown as MediaStream
      const requestMediaStream = vi.fn().mockResolvedValue(stream)
      const releaseMediaStream = vi.fn()

      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream,
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(
        await screen.findByRole('button', { name: `Turn On ${kind}` })
      )

      expect(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      ).toBeInTheDocument()

      expect(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      ).toHaveClass(VARIANT.success)

      await user.click(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      )

      expect(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      ).toBeDisabled()

      expect(
        await screen.findByRole('button', { name: `Turn On ${kind}` })
      ).toBeInTheDocument()

      expect(
        await screen.findByRole('button', { name: `Turn On ${kind}` })
      ).toHaveClass(VARIANT.danger)

      expect(upsertProducer).toHaveBeenNthCalledWith(2, {
        userId: sessionUser.id,
        spaceId: space.id,
        producerId: producer.id,
        state: 'PAUSED',
        kind,
      })

      expect(releaseMediaStream).toHaveBeenCalledWith(stream)

      await user.click(
        await screen.findByRole('button', { name: `Turn On ${kind}` })
      )

      expect(
        await screen.findByRole('button', { name: `Turn On ${kind}` })
      ).toBeDisabled()

      expect(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      ).toHaveClass(VARIANT.success)

      expect(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      ).not.toBeDisabled()

      expect(producer.replaceStream).toHaveBeenCalledWith(stream)

      expect(requestMediaStream).toHaveBeenCalledTimes(2)

      expect(upsertProducerMock).toHaveBeenNthCalledWith(3, {
        userId: sessionUser.id,
        spaceId: space.id,
        producerId: producer.id,
        state: 'ACTIVE',
        kind,
      })
    }
  )

  test.each(['video', 'audio'] as const)(
    'switches to newly selected %s device while streaming',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      const track = {
        kind,
        addEventListener: vi.fn(),
      } as unknown as MediaStreamTrack

      const stream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const newStream = {
        getTracks: () => [track],
      } as unknown as MediaStream
      const deviceId = 'DEVICE_ID'
      const newDeviceId = 'NEW_DEVICE_ID'

      const requestMediaStream = vi.fn().mockImplementation((id) => {
        if (id === deviceId) {
          return stream
        }
        if (id === newDeviceId) {
          return newStream
        }

        return null
      })

      const releaseMediaStream = vi.fn()

      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream,
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      const defaultLabel = 'DEFAULT_LABEL'
      const secondaryLabel = 'SECONDARY_LABEL'
      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([
            {
              deviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: defaultLabel,
              groupId: 'GROUP_ID_1',
            } as MediaDeviceInfo,

            {
              deviceId: newDeviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: secondaryLabel,
              groupId: 'GROUP_ID_2',
            } as MediaDeviceInfo,
          ]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: defaultLabel })
      )

      await user.click(screen.getByRole('button', { name: `Turn On ${kind}` }))

      expect(requestMediaStream).toHaveBeenNthCalledWith(1, deviceId)

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: secondaryLabel })
      )

      expect(requestMediaStream).toHaveBeenNthCalledWith(2, newDeviceId)

      expect(releaseMediaStream).toHaveBeenCalledWith(stream)

      expect(producer.replaceStream).toHaveBeenCalledWith(newStream)

      expect(
        screen.queryByRole('status', { name: 'Loading' })
      ).not.toBeInTheDocument()

      expect(
        await screen.findByRole('button', { name: `Turn Off ${kind}` })
      ).not.toBeDisabled()
    }
  )

  test.each(['video', 'audio'] as const)(
    'skips %s device switching when no mediaSession',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      const track = {
        kind,
        addEventListener: vi.fn(),
      } as unknown as MediaStreamTrack

      const stream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const newStream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const deviceId = 'DEVICE_ID'
      const newDeviceId = 'NEW_DEVICE_ID'

      const requestMediaStream = vi.fn().mockImplementation((id) => {
        if (id === deviceId) {
          return stream
        }
        if (id === newDeviceId) {
          return newStream
        }

        return null
      })

      const releaseMediaStream = vi.fn()

      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream,
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      const defaultLabel = 'DEFAULT_LABEL'
      const secondaryLabel = 'SECONDARY_LABEL'
      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([
            {
              deviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: defaultLabel,
              groupId: 'GROUP_ID_1',
            } as MediaDeviceInfo,

            {
              deviceId: newDeviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: secondaryLabel,
              groupId: 'GROUP_ID_2',
            } as MediaDeviceInfo,
          ]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: defaultLabel })
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: secondaryLabel })
      )

      expect(requestMediaStream).not.toHaveBeenCalled()

      expect(releaseMediaStream).not.toHaveBeenCalled()

      expect(
        screen.queryByRole('status', { name: 'Loading' })
      ).not.toBeInTheDocument()
    }
  )

  test.each(['video', 'audio'] as const)(
    'skips %s device switching when selecting new device with no active stream',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      const track = {
        kind,
        addEventListener: vi.fn(),
      } as unknown as MediaStreamTrack

      const stream = null

      const newStream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const deviceId = 'DEVICE_ID'
      const newDeviceId = 'NEW_DEVICE_ID'

      const requestMediaStream = vi.fn().mockImplementation((id) => {
        if (id === deviceId) {
          return stream
        }
        if (id === newDeviceId) {
          return newStream
        }

        return null
      })

      const releaseMediaStream = vi.fn()

      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream,
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      const defaultLabel = 'DEFAULT_LABEL'
      const secondaryLabel = 'SECONDARY_LABEL'
      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([
            {
              deviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: defaultLabel,
              groupId: 'GROUP_ID_1',
            } as MediaDeviceInfo,

            {
              deviceId: newDeviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: secondaryLabel,
              groupId: 'GROUP_ID_2',
            } as MediaDeviceInfo,
          ]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: defaultLabel })
      )

      await user.click(screen.getByRole('button', { name: `Turn On ${kind}` }))

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: secondaryLabel })
      )

      expect(requestMediaStream).not.toHaveBeenCalledWith(newDeviceId)

      expect(releaseMediaStream).not.toHaveBeenCalled()

      expect(producer.replaceStream).not.toHaveBeenCalled()

      expect(
        screen.queryByRole('status', { name: 'Loading' })
      ).not.toBeInTheDocument()
    }
  )

  test.each(['video', 'audio'] as const)(
    'skips %s device switching when the new selected device does not have mediaStream',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      const track = {
        kind,
        addEventListener: vi.fn(),
      } as unknown as MediaStreamTrack

      const stream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const newStream = null

      const deviceId = 'DEVICE_ID'
      const newDeviceId = 'NEW_DEVICE_ID'

      const requestMediaStream = vi.fn().mockImplementation((id) => {
        if (id === deviceId) {
          return stream
        }
        if (id === newDeviceId) {
          return newStream
        }

        return null
      })

      const releaseMediaStream = vi.fn()

      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream,
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      const defaultLabel = 'DEFAULT_LABEL'
      const secondaryLabel = 'SECONDARY_LABEL'
      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([
            {
              deviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: defaultLabel,
              groupId: 'GROUP_ID_1',
            } as MediaDeviceInfo,

            {
              deviceId: newDeviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: secondaryLabel,
              groupId: 'GROUP_ID_2',
            } as MediaDeviceInfo,
          ]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: defaultLabel })
      )

      await user.click(screen.getByRole('button', { name: `Turn On ${kind}` }))

      expect(requestMediaStream).toHaveBeenNthCalledWith(1, deviceId)

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: secondaryLabel })
      )

      expect(releaseMediaStream).toHaveBeenCalled()

      expect(requestMediaStream).toHaveBeenNthCalledWith(2, 'NEW_DEVICE_ID')

      expect(producer.replaceStream).not.toHaveBeenCalledWith(newStream)

      expect(
        screen.queryByRole('status', { name: 'Loading' })
      ).not.toBeInTheDocument()
    }
  )

  test.each(['video', 'audio'] as const)(
    'skips %s device switching when user select the same device',
    async (kind) => {
      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      const space = { id: 'SPACE_ID' }
      useSpaceMock.mockReturnValue({
        data: space,
      } as unknown as ReturnType<typeof useSpace>)

      const sessionUser = { id: 'USER_ID' }
      useSessionUserMock.mockReturnValue({
        data: sessionUser,
      } as unknown as ReturnType<typeof useSessionUser>)

      const track = {
        kind,
        addEventListener: vi.fn(),
      } as unknown as MediaStreamTrack

      const stream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const newStream = {
        getTracks: () => [track],
      } as unknown as MediaStream

      const deviceId = 'DEVICE_ID'
      const newDeviceId = 'NEW_DEVICE_ID'

      const requestMediaStream = vi.fn().mockImplementation((id) => {
        if (id === deviceId) {
          return stream
        }
        if (id === newDeviceId) {
          return newStream
        }

        return null
      })

      const releaseMediaStream = vi.fn()

      useMediaMock.mockReturnValue({
        requestMediaStream,
        releaseMediaStream,
      })

      const producer = { id: 'PRODUCER_ID', replaceStream: vi.fn() }

      const user = userEvent.setup()

      const mediasoupClient = {
        produce: vi.fn().mockResolvedValue(producer),
        consume: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      const userMediaStream = {
        getTracks: (): MediaStreamTrack[] => [],
      } as unknown as MediaStream

      const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

      const defaultLabel = 'DEFAULT_LABEL'
      const secondaryLabel = 'SECONDARY_LABEL'
      vi.stubGlobal('navigator', {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue([
            {
              deviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: defaultLabel,
              groupId: 'GROUP_ID_1',
            } as MediaDeviceInfo,

            {
              deviceId: newDeviceId,
              kind: kind === 'video' ? 'videoinput' : 'audioinput',
              label: secondaryLabel,
              groupId: 'GROUP_ID_2',
            } as MediaDeviceInfo,
          ]),

          getUserMedia,
        },
      })

      const icon = vi.fn((isStreaming) =>
        isStreaming
          ? { name: 'play' as IconName, label: `Turn Off ${kind}` }
          : { name: 'pause' as IconName, label: `Turn On ${kind}` }
      )

      render(
        <Media
          mediasoupClient={mediasoupClient}
          icon={icon}
          label={kind}
          kind={kind}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(
        await screen.findByRole('button', { name: defaultLabel })
      )

      await user.click(screen.getByRole('button', { name: `Turn On ${kind}` }))

      await user.click(screen.getByRole('button', { name: 'Config' }))
      await user.click(await screen.findByText(defaultLabel))

      expect(requestMediaStream).toHaveBeenCalledTimes(1)

      expect(releaseMediaStream).not.toHaveBeenCalled()

      expect(producer.replaceStream).not.toHaveBeenCalledWith(newStream)

      expect(
        screen.queryByRole('status', { name: 'Loading' })
      ).not.toBeInTheDocument()
    }
  )
})
