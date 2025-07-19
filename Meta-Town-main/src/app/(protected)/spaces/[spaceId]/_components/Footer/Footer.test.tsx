import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { VARIANT } from '@/components/Button'
import upsertProducer from '@/db/upsertProducer'
import useOnlineUsers from '@/hooks/useOnlineUsers'
import useProducers from '@/hooks/useProducers'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import navigate from '@/utils/navigate'
import useMedia from './_components/Media/_hooks/useMedia'
import Footer from './Footer'

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useOnlineUsers')
const useOnlineUsersMock = vi.mocked(useOnlineUsers)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/utils/navigate')

vi.mock('./_components/Media/_hooks/useMedia')
const useMediaMock = vi.mocked(useMedia)

vi.mock('@/db/upsertProducer')
const upsertProducerMock = vi.mocked(upsertProducer)

vi.mock('@/hooks/useProducers')
const useProducersMock = vi.mocked(useProducers)

describe('Footer', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders the Main menu button', () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Footer onChatClick={vi.fn()} onParticipantsClick={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Meta Town' })).toBeInTheDocument()
  })

  test.each([
    'Turn On Camera',
    'Turn On Microphone',
    'Start Screen Share',
  ] as const)(
    'does not render %s button when no mediasoup client provided',
    (label) => {
      useSessionUserMock.mockReturnValue({
        data: { id: 'USER_ID' },
      } as unknown as ReturnType<typeof useSessionUser>)

      useParamsMock.mockReturnValue({
        spaceId: 'SPACE_ID',
      })

      useSpaceMock.mockReturnValue({
        data: { id: 'SPACE_ID' },
      } as unknown as ReturnType<typeof useSpace>)

      useOnlineUsersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useOnlineUsers>)

      render(<Footer onChatClick={vi.fn()} onParticipantsClick={vi.fn()} />)

      expect(
        screen.queryByRole('button', { name: label })
      ).not.toBeInTheDocument()
    }
  )

  test('renders camera configurable', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const producer = { id: 'PRODUCER_ID' }

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
    }

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

    const user = userEvent.setup()

    render(
      <Footer
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
        mediasoupClient={mediasoupClient}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    ).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Camera' })
    )
    expect(requestMediaStream).toHaveBeenCalled()
    expect(
      await screen.findByRole('button', { name: 'Turn Off Camera' })
    ).toBeInTheDocument()
    expect(upsertProducerMock).toHaveBeenCalled()
  })

  test('renders microphone configurable', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const producer = { id: 'PRODUCER_ID' }

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
    }

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

    const user = userEvent.setup()

    render(
      <Footer
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
        mediasoupClient={mediasoupClient}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Turn On Microphone' })
    ).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'Turn On Microphone' })
    )
    expect(requestMediaStream).toHaveBeenCalled()
    expect(
      await screen.findByRole('button', { name: 'Turn Off Microphone' })
    ).toBeInTheDocument()
    expect(upsertProducerMock).toHaveBeenCalled()
  })

  test('renders screen share button', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const producer = { id: 'PRODUCER_ID' }

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
    }

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

    const user = userEvent.setup()

    render(
      <Footer
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
        mediasoupClient={mediasoupClient}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Start Screen Share' })
    ).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'Start Screen Share' })
    )
    expect(requestMediaStream).toHaveBeenCalled()
    expect(
      await screen.findByRole('button', { name: 'Stop Screen Share' })
    ).toBeInTheDocument()
    expect(upsertProducerMock).toHaveBeenCalled()
  })

  test('renders record button', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    useMediaMock.mockReturnValue({
      requestMediaStream: vi.fn(),
      releaseMediaStream: vi.fn(),
    })

    render(
      <Footer
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
        mediasoupClient={{
          produce: vi.fn(),
          consume: vi.fn(),
        }}
        recorder={{ stream: {} as MediaStream }}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Start Recording' })
    ).toBeInTheDocument()
  })

  test('renders EmojiTrigger', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const producer = { id: 'PRODUCER_ID' }

    const mediasoupClient = {
      produce: vi.fn().mockResolvedValue(producer),
      consume: vi.fn(),
    }

    const stream = {} as unknown as MediaStream
    const requestMediaStream = vi.fn().mockResolvedValue(stream)

    useMediaMock.mockReturnValue({
      requestMediaStream,
      releaseMediaStream: vi.fn(),
    })

    render(
      <Footer
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
        mediasoupClient={mediasoupClient}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Emoji' })
    ).toBeInTheDocument()
  })

  test('renders Chat button', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Footer onChatClick={vi.fn()} onParticipantsClick={vi.fn()} />)

    expect(await screen.findByRole('button', { name: 'Chat' })).toHaveClass(
      VARIANT.naked
    )
  })

  test('renders secondary Button with isChatActive', async () => {
    useProducersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useProducers>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(
      <Footer
        isChatActive
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
      />
    )

    expect(await screen.findByRole('button', { name: 'Chat' })).toHaveClass(
      VARIANT.secondary
    )
  })

  test('calls onChatClick when Chat button is clicked', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Footer onChatClick={handleClick} onParticipantsClick={handleClick} />
    )

    await user.click(await screen.findByRole('button', { name: 'Chat' }))

    expect(handleClick).toBeCalled()
  })

  test('renders participants button', () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(<Footer onChatClick={vi.fn()} onParticipantsClick={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Participants' })
    ).toBeInTheDocument()
  })

  test('renders secondary Button with isParticipantsActive', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    render(
      <Footer
        isParticipantsActive
        onChatClick={vi.fn()}
        onParticipantsClick={vi.fn()}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Participants' })
    ).toHaveClass(VARIANT.secondary)
  })

  test('calls onParticipantsClick when participants button is clicked', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Footer onChatClick={handleClick} onParticipantsClick={handleClick} />
    )

    await user.click(
      await screen.findByRole('button', { name: 'Participants' })
    )

    expect(handleClick).toBeCalled()
  })

  test('navigates to the home page when click leave space button', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useSpace>)

    useOnlineUsersMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useOnlineUsers>)

    const user = userEvent.setup()

    render(<Footer onChatClick={vi.fn()} onParticipantsClick={vi.fn()} />)

    expect(
      await screen.findByRole('button', { name: 'Leave Space' })
    ).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Leave Space' }))

    expect(navigate).toHaveBeenCalledWith('/spaces')
  })
})
