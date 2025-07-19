import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useProducers from '@/hooks/useProducers'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUser from '@/hooks/useUser'
import Layout, { FOCUS } from './Layout'
import useConsume from './_components/Participant/_hooks/useConsume'
import useLayout from './_hooks/useLayout'

vi.mock('@/hooks/useUser')
const useUserMock = vi.mocked(useUser)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useEmojiReaction')
const useEmojiReactionMock = vi.mocked(useEmojiReaction)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useProducers')
const useProducersMock = vi.mocked(useProducers)

vi.mock('./_components/Participant/_hooks/useConsume')
const useConsumeMock = vi.mocked(useConsume)

vi.mock('./_hooks/useLayout')
const useLayoutMock = vi.mocked(useLayout)

describe('Layout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each([
    {
      view: 'Map',
      isSingleLayout: 'column',
      container: 'column',
      layout: { columns: 4, rows: 1 },
    },
    {
      view: 'Meeting',
      isSingleLayout: undefined,
      container: 'grid',
      layout: { columns: 5, rows: 4 },
    },
  ] as const)(
    'renders layout when view is $view',
    ({ view, isSingleLayout, layout }) => {
      const count = 20

      const users = Array.from({ length: count }, (_, i) => `USER_ID_${i}`)

      useUserMock.mockReturnValue({
        data: { id: 'USER_ID' },
      } as unknown as ReturnType<typeof useUser>)

      useSessionUserMock.mockReturnValue({
        data: { id: 'SESSION_USER_ID' },
      } as unknown as ReturnType<typeof useSessionUser>)

      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      useSpaceMock.mockReturnValue({
        data: {
          id: 'SPACE_ID',
        },
      } as ReturnType<typeof useSpace>)

      useEmojiReactionMock.mockReturnValue({
        data: null,
      } as unknown as ReturnType<typeof useEmojiReaction>)

      const mediasoupClient = {
        consume: vi.fn(),
        produce: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      useLayoutMock.mockReturnValue(layout)

      render(
        <Layout view={view} mediasoupClient={mediasoupClient} users={users} />
      )

      expect(screen.getByRole('region', { name: view })).toBeInTheDocument()

      expect(useLayout).toHaveBeenCalledWith(
        { current: screen.getByRole('group', { name: 'Placeholders' }) },
        count,
        isSingleLayout
      )

      expect(
        within(
          screen.getByRole('group', { name: 'Placeholders' })
        ).getAllByRole('presentation', { name: /^.+:participant$/ })
      ).toHaveLength(layout.rows * layout.columns)
    }
  )

  test.each([
    {
      view: 'Map',
      isSingleLayout: 'column',
      container: 'column',
      layout: { columns: 4, rows: 1 },
    },
    {
      view: 'Meeting',
      isSingleLayout: 'row',
      container: 'row',
      layout: { columns: 3, rows: 3 },
    },
  ] as const)(
    'renders focused layout when view is $view',
    async ({ view, isSingleLayout, layout }) => {
      const count = 20

      const users = Array.from({ length: count }, (_, i) => `USER_ID_${i}`)

      useUserMock.mockReturnValue({
        data: { id: 'USER_ID' },
      } as unknown as ReturnType<typeof useUser>)

      useSessionUserMock.mockReturnValue({
        data: { id: 'SESSION_USER_ID' },
      } as unknown as ReturnType<typeof useSessionUser>)

      useProducersMock.mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useProducers>)

      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      useSpaceMock.mockReturnValue({
        data: {
          id: 'SPACE_ID',
        },
      } as ReturnType<typeof useSpace>)

      useEmojiReactionMock.mockReturnValue({
        data: null,
      } as unknown as ReturnType<typeof useEmojiReaction>)

      const mediasoupClient = {
        consume: vi.fn(),
        produce: vi.fn(),
        mediaRecorder: {} as MediaRecorder,
      }

      useLayoutMock.mockReturnValue(layout)

      const user = userEvent.setup()

      render(
        <Layout view={view} mediasoupClient={mediasoupClient} users={users} />
      )

      expect(
        await within(
          screen.getByRole('presentation', {
            name: 'USER_ID_0:participant',
          })
        ).findByRole('button', { name: 'Focus' })
      ).toBeInTheDocument()

      await user.click(
        await within(
          screen.getByRole('presentation', {
            name: 'USER_ID_0:participant',
          })
        ).findByRole('button', { name: 'Focus' })
      )

      expect(useLayout).toHaveBeenCalledWith(
        { current: screen.getByRole('group', { name: 'Placeholders' }) },
        count,
        isSingleLayout
      )

      expect(
        screen.getByRole('group', { name: 'Focused Placeholder' })
      ).toHaveClass(FOCUS[view])

      expect(
        await within(
          screen.getByRole('presentation', {
            name: 'USER_ID_0:participant',
          })
        ).findByRole('button', { name: 'Minimize' })
      ).toBeInTheDocument()

      expect(
        within(
          screen.getByRole('group', { name: 'Placeholders' })
        ).getAllByRole('presentation', { name: /^.+:participant$/ })
      ).toHaveLength(layout.rows * layout.columns)

      expect(
        within(screen.getByRole('group', { name: 'Placeholders' })).queryByRole(
          'presentation',
          {
            name: 'USER_ID_0:participant',
          }
        )
      ).not.toBeInTheDocument()

      expect(
        screen.getByRole('presentation', {
          name: 'USER_ID_0:participant',
        })
      ).toBeInTheDocument()

      await user.click(
        await within(
          screen.getByRole('presentation', {
            name: 'USER_ID_0:participant',
          })
        ).findByRole('button', { name: 'Minimize' })
      )

      expect(
        within(screen.getByRole('group', { name: 'Placeholders' })).getByRole(
          'presentation',
          {
            name: 'USER_ID_0:participant',
          }
        )
      ).toBeInTheDocument()
    }
  )

  test('renders screen placeholder when screen producer is present', async () => {
    const count = 20

    const users = Array.from({ length: count }, (_, i) => `USER_ID_${i}`)

    useUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useProducersMock.mockReturnValue({
      data: [
        {
          id: 'PRODUCER_ID',
          userId: 'USER_ID_0',
          kind: 'screen',
          state: 'ACTIVE',
        },
      ],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: {
        id: 'SPACE_ID',
      },
    } as ReturnType<typeof useSpace>)

    useEmojiReactionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useEmojiReaction>)

    const mediasoupClient = {
      consume: vi.fn(),
      produce: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

    const layout = { columns: 4, rows: 1 }
    useLayoutMock.mockReturnValue(layout)

    const user = userEvent.setup()

    render(
      <Layout view="Map" mediasoupClient={mediasoupClient} users={users} />
    )

    expect(
      within(screen.getByRole('group', { name: 'Placeholders' })).getAllByRole(
        'presentation',
        { name: /^.+:participant$/ }
      )
    ).toHaveLength(layout.rows * layout.columns)

    expect(
      within(screen.getByRole('group', { name: 'Placeholders' })).queryByRole(
        'presentation',
        {
          name: 'USER_ID_0:screen',
        }
      )
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('presentation', {
        name: 'USER_ID_0:screen',
      })
    ).toBeInTheDocument()

    await user.click(
      await within(
        screen.getByRole('presentation', {
          name: 'USER_ID_0:screen',
        })
      ).findByRole('button', { name: 'Minimize' })
    )

    expect(useLayout).toHaveBeenCalledWith(
      { current: screen.getByRole('group', { name: 'Placeholders' }) },
      count,
      'column'
    )

    expect(
      within(screen.getByRole('group', { name: 'Placeholders' })).getAllByRole(
        'presentation',
        { name: /^.+:participant$/ }
      )
    ).toHaveLength(layout.rows * layout.columns - 1)

    expect(
      within(screen.getByRole('group', { name: 'Placeholders' })).getByRole(
        'presentation',
        { name: 'USER_ID_0:screen' }
      )
    ).toBeInTheDocument()

    await user.click(
      await within(
        screen.getByRole('presentation', {
          name: 'USER_ID_0:screen',
        })
      ).findByRole('button', { name: 'Focus' })
    )

    expect(
      within(screen.getByRole('group', { name: 'Placeholders' })).getAllByRole(
        'presentation',
        { name: /^.+:participant$/ }
      )
    ).toHaveLength(layout.rows * layout.columns)

    expect(
      within(screen.getByRole('group', { name: 'Placeholders' })).queryByRole(
        'presentation',
        {
          name: 'USER_ID_0:screen',
        }
      )
    ).not.toBeInTheDocument()
  })

  test('renders video controls for each participant', () => {
    const users = ['USER_ID']

    const user = { id: 'USER_ID', displayName: 'User Name' }
    useUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useUser>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'SESSION_USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useProducersMock.mockReturnValue({
      data: [
        {
          id: 'VIDEO_PRODUCER_ID',
          userId: 'USER_ID',
          kind: 'video',
          state: 'ACTIVE',
        },
        {
          id: 'AUDIO_PRODUCER_ID',
          userId: 'USER_ID',
          kind: 'audio',
          state: 'ACTIVE',
        },
        {
          id: 'SCREEN_PRODUCER_ID',
          userId: 'USER_ID',
          kind: 'screen',
          state: 'ACTIVE',
        },
      ],
    } as unknown as ReturnType<typeof useProducers>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: {
        id: 'SPACE_ID',
      },
    } as ReturnType<typeof useSpace>)

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

    const mediasoupClient = {
      consume: vi.fn(),
      produce: vi.fn(),
      mediaRecorder: {} as MediaRecorder,
    }

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

    useLayoutMock.mockReturnValue({ columns: 4, rows: 1 })

    render(
      <Layout
        view="Meeting"
        mediasoupClient={mediasoupClient}
        users={users}
        recorder={recorder}
      />
    )

    expect(
      within(
        screen.getByRole('presentation', { name: 'USER_ID:participant' })
      ).getByText(user.displayName)
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByRole('presentation', { name: 'USER_ID:participant' })
      ).getByLabelText('Video Feed')
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByRole('presentation', { name: 'USER_ID:participant' })
      ).getByText(emoji.unicode)
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByRole('presentation', { name: 'USER_ID:screen' })
      ).getByText(`${user.displayName} is Sharing`)
    ).toBeInTheDocument()

    expect(recorder.addTrack).toHaveBeenCalledWith(audioTrack)
    expect(recorder.addTrack).toHaveBeenCalledWith(videoTrack)

    vi.unstubAllGlobals()
  })
})
