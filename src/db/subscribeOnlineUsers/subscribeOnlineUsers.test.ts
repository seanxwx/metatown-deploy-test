import createSupabaseClient from '@/utils/createSupabaseClient'
import getSession from '@/db/getSession'
import getSessionUser from '@/db/getSessionUser'
import subscribeOnlineUsers from './subscribeOnlineUsers'
import createSyncHandler from './utils/createSyncHandler'

vi.mock('@/db/getSession')
const getSessionMock = vi.mocked(getSession)

vi.mock('@/db/getSessionUser')
const getSessionUserMock = vi.mocked(getSessionUser)

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

vi.mock('./utils/createSyncHandler')
const createSyncHandlerMock = vi.mocked(createSyncHandler)

describe('subscribeOnlineUsers', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('subscribes to `online-users:spaceId` channel', async () => {
    const spaceId = 'SPACE_ID'

    const channel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      track: vi.fn(),
    }

    const supabaseClient = {
      channel: vi.fn().mockReturnValue(channel),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const session = { user: { id: 'SESSION_USER_ID' } }
    getSessionMock.mockResolvedValue(
      session as Awaited<ReturnType<typeof getSession>>
    )

    const sessionUser = { id: 'USER_ID' }
    getSessionUserMock.mockResolvedValue(
      sessionUser as Awaited<ReturnType<typeof getSessionUser>>
    )

    const next = vi.fn()
    const key: [string, string] = ['online-users', spaceId]

    const handleSync = vi.fn()
    createSyncHandlerMock.mockReturnValue(handleSync)

    const unsubscribe = subscribeOnlineUsers(key, { next })

    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `online-users:${spaceId}`
    )

    expect(channel.subscribe).toHaveBeenCalled()

    expect(createSyncHandler).toHaveBeenCalledWith({ next }, channel)

    await vi.waitFor(() =>
      expect(channel.on).toHaveBeenCalledWith(
        'presence',
        { event: 'sync' },
        handleSync
      )
    )

    expect(getSession).toHaveBeenCalled()
    expect(getSessionUser).toHaveBeenCalledWith([
      'session-user',
      session.user.id,
    ])

    expect(channel.track).toHaveBeenCalledWith({
      userId: sessionUser.id,
    })

    unsubscribe()

    expect(supabaseClient.removeChannel).toHaveBeenCalledWith(channel)
  })

  test('does not track if session is not available', () => {
    const channel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      track: vi.fn(),
    }

    const supabaseClient = {
      channel: vi.fn().mockReturnValue(channel),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const next = vi.fn()
    const key: [string, string] = ['online-users', 'SPACE_ID']

    const handleSync = vi.fn()
    createSyncHandlerMock.mockReturnValue(handleSync)

    subscribeOnlineUsers(key, { next })

    expect(getSessionUser).not.toHaveBeenCalled()

    expect(channel.on).not.toHaveBeenCalled()
    expect(channel.track).not.toHaveBeenCalled()
  })

  test('does not track if session user is not available', () => {
    const channel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      track: vi.fn(),
    }

    const supabaseClient = {
      channel: vi.fn().mockReturnValue(channel),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    getSessionMock.mockResolvedValue({
      user: { id: 'SESSION_USER_ID' },
    } as Awaited<ReturnType<typeof getSession>>)

    const next = vi.fn()
    const key: [string, string] = ['online-users', 'SPACE_ID']

    const handleSync = vi.fn()
    createSyncHandlerMock.mockReturnValue(handleSync)

    subscribeOnlineUsers(key, { next })

    expect(channel.on).not.toHaveBeenCalled()
    expect(channel.track).not.toHaveBeenCalled()
  })
})
