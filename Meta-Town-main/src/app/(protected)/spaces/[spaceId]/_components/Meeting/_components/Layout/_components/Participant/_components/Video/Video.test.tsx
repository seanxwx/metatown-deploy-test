import { render, screen } from '@testing-library/react'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useUser from '@/hooks/useUser'
import useConsume from '../../_hooks/useConsume'
import Video from './Video'

vi.mock('../../_hooks/useConsume')
const useConsumeMock = vi.mocked(useConsume)

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

describe('Video', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders video', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    useUserMock.mockReturnValue({} as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
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
  })

  test('calls useConsume with null producerId when state is PAUSED', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'PAUSED',
    } as const

    useConsumeMock.mockReturnValue(null)

    useUserMock.mockReturnValue({} as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useConsume).toHaveBeenCalledWith(mediasoupClient, null)
  })

  test('calls useConsume with null producerId when producer is not provided', () => {
    const mediasoupClient = {} as MediasoupClient

    useConsumeMock.mockReturnValue(null)

    useUserMock.mockReturnValue({} as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
        mediasoupClient={mediasoupClient}
        userId="USER_ID"
        portal={portal}
      />,
      {
        container: document.body.appendChild(portal),
      }
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

    useUserMock.mockReturnValue({} as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()
  })

  test('does not render video when portal is null', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useUserMock.mockReturnValue({} as ReturnType<typeof useUser>)

    useConsumeMock.mockReturnValue(stream)

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={null}
      />
    )

    expect(screen.queryByLabelText('Video Feed')).not.toBeInTheDocument()
  })

  test('renders avatar when user has no active video stream', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'PAUSED',
    } as const

    useConsumeMock.mockReturnValue(null)

    const userId = 'USER_ID'
    const displayName = 'John Doe'

    useUserMock.mockReturnValue({
      data: {
        id: userId,
        displayName,
        avatar: 'FEMALE_01',
      },
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(useUser).toHaveBeenCalledWith(userId)

    expect(screen.getByRole('img', { name: displayName })).toBeInTheDocument()
  })

  test('does not render avatar when video stream is active', () => {
    const mediasoupClient = {} as MediasoupClient
    const stream = {} as MediaStream

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
    } as const

    useConsumeMock.mockReturnValue(stream)

    const displayName = 'John Doe'

    useUserMock.mockReturnValue({
      data: {
        id: 'USER_ID',
        displayName,
        avatar: 'FEMALE_01',
      },
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(
      screen.queryByRole('img', { name: displayName })
    ).not.toBeInTheDocument()
  })

  test('does not render avatar when portal is null', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'PAUSED',
    } as const

    useConsumeMock.mockReturnValue(null)

    const displayName = 'John Doe'

    useUserMock.mockReturnValue({
      data: {
        id: 'USER_ID',
        displayName,
        avatar: 'FEMALE_01',
      },
    } as ReturnType<typeof useUser>)

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={null}
      />
    )

    expect(
      screen.queryByRole('img', { name: displayName })
    ).not.toBeInTheDocument()
  })

  test('does not render avatar when user data is null', () => {
    const mediasoupClient = {} as MediasoupClient

    const producer = {
      producerId: 'PRODUCER_ID',
      state: 'PAUSED',
    } as const

    useConsumeMock.mockReturnValue(null)

    useUserMock.mockReturnValue({
      data: null,
    } as ReturnType<typeof useUser>)

    const portal = document.createElement('div')

    render(
      <Video
        mediasoupClient={mediasoupClient}
        producer={producer}
        userId="USER_ID"
        portal={portal}
      />,
      { container: document.body.appendChild(portal) }
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
