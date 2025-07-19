import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useUser from '@/hooks/useUser'
import useConsume from '../../_hooks/useConsume'
import Screen from './Screen'

vi.mock('../../_hooks/useConsume')
const useConsumeMock = vi.mocked(useConsume)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('Screen', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders screen', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    const userId = 'USER_ID'
    const user = { id: userId, displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Screen
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
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

    expect(useUser).toHaveBeenCalledWith(userId)

    expect(
      screen.getByText(`${user.displayName} is Sharing`)
    ).toBeInTheDocument()
  })

  test('calls useConsume with null producerId when state is PAUSED', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'PAUSED',
    } as const

    useConsumeMock.mockReturnValue(null)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Screen
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(mediasoupClient, null)
  })

  test('calls useConsume with producer is not provided', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Screen
        mediasoupClient={mediasoupClient}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(mediasoupClient, null)
  })

  test('does not render video when useConsume returns null', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(null)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Screen
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()

    expect(
      screen.getByText(`${user.displayName} is Sharing`)
    ).toBeInTheDocument()
  })

  test('does not render video when portal is null', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useUserMock.mockReturnValue({
      data: user,
    } as ReturnType<typeof useUser>)

    render(
      <Screen
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={null}
      />
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()

    expect(
      screen.queryByText(`${user.displayName} is Sharing`)
    ).not.toBeInTheDocument()
  })

  test('records screen', () => {
    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    const recorder = {
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
    }

    const track = { id: 'VIDEO_TACK_ID' }

    const mediaStream = {
      getVideoTracks: vi.fn().mockReturnValue([track]),
    } as unknown as MediaStream

    useConsumeMock.mockReturnValue(mediaStream)

    const { unmount } = render(
      <Screen
        mediasoupClient={{} as MediasoupClient}
        userId="USER_ID"
        portal={document.createElement('div')}
        recorder={recorder}
      />
    )

    expect(recorder.addTrack).toHaveBeenCalledWith(track)

    unmount()

    expect(recorder.removeTrack).toHaveBeenCalledWith(track)
  })

  test('does not record screen when no audio track is available', () => {
    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    const recorder = {
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
    }

    useConsumeMock.mockReturnValue(null)

    render(
      <Screen
        mediasoupClient={{} as MediasoupClient}
        userId="USER_ID"
        portal={document.createElement('div')}
        recorder={recorder}
      />
    )

    expect(recorder.addTrack).not.toHaveBeenCalled()
  })

  test('zooms screen', async () => {
    useConsumeMock.mockReturnValue({} as MediaStream)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    const user = userEvent.setup()

    render(
      <Screen
        mediasoupClient={{} as MediasoupClient}
        producer={{
          producerId: 'PRODUCER_ID',
          state: 'ACTIVE',
        }}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(
      await screen.findByRole('button', { name: 'Zoom In' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Zoom Out' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Reset Zoom' })
    ).not.toBeInTheDocument()

    for (let i = 0; i < 10; i++) {
      await user.click(await screen.findByRole('button', { name: 'Zoom In' }))
    }

    expect(screen.getByRole('region', { name: 'Screen' })).toHaveStyle({
      transform: 'scale(1.5)',
    })

    expect(
      await screen.findByRole('button', { name: 'Reset Zoom' })
    ).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Reset Zoom' }))

    expect(screen.getByRole('region', { name: 'Screen' })).not.toHaveStyle({
      transform: 'scale(1)',
    })

    expect(
      screen.queryByRole('button', { name: 'Reset Zoom' })
    ).not.toBeInTheDocument()

    for (let i = 0; i < 10; i++) {
      await user.click(await screen.findByRole('button', { name: 'Zoom Out' }))
    }

    expect(screen.getByRole('region', { name: 'Screen' })).toHaveStyle({
      transform: 'scale(0.5)',
    })
  })

  test('drags screen', async () => {
    useConsumeMock.mockReturnValue({} as MediaStream)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' },
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    const user = userEvent.setup()

    render(
      <Screen
        mediasoupClient={{} as MediasoupClient}
        producer={{
          producerId: 'PRODUCER_ID',
          state: 'ACTIVE',
        }}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(screen.getByRole('region', { name: 'Screen' })).not.toHaveClass(
      'cursor-grab'
    )

    await user.click(await screen.findByRole('button', { name: 'Zoom In' }))

    expect(screen.getByRole('region', { name: 'Screen' })).toHaveClass(
      'cursor-grab'
    )

    fireEvent.mouseDown(screen.getByRole('region', { name: 'Screen' }), {
      target: screen.getByRole('region', { name: 'Screen' }),
    })

    fireEvent.mouseMove(document, {
      clientX: 50,
      clientY: 100,
    })

    fireEvent.mouseUp(document)

    expect(screen.getByRole('region', { name: 'Screen' })).toHaveStyle({
      left: '50px',
      top: '100px',
    })

    await user.click(await screen.findByRole('button', { name: 'Reset Zoom' }))

    expect(screen.getByRole('region', { name: 'Screen' })).not.toHaveClass(
      'cursor-grab'
    )

    expect(screen.getByRole('region', { name: 'Screen' })).not.toHaveStyle({
      left: '50px',
      top: '100px',
    })

    fireEvent.mouseDown(screen.getByRole('region', { name: 'Screen' }), {
      target: screen.getByRole('region', { name: 'Screen' }),
    })

    fireEvent.mouseMove(document, {
      clientX: 50,
      clientY: 100,
    })

    fireEvent.mouseUp(document)

    expect(screen.getByRole('region', { name: 'Screen' })).not.toHaveStyle({
      left: '50px',
      top: '100px',
    })
  })
})
