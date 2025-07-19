import { renderHook, waitFor } from '@testing-library/react'
import { useParams } from 'next/navigation'
import upsertSpacePresence from '@/db/upsertSpacePresence'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useUserPresences from '@/hooks/useUserPresences'
import useSyncSpacePresence from './useSyncSpacePresence'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('next/navigation')
const userParamsMock = vi.mocked(useParams)

vi.mock('@/db/upsertSpacePresence')

describe('useSyncSpacePresence', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('does not call upsertSpacePresence if there is no user', () => {
    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSessionUser>
    )

    userParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useUserPresences>)

    renderHook(() => useSyncSpacePresence())

    expect(upsertSpacePresence).not.toBeCalled()
  })

  test('does not call upsertSpacePresence if there is no space', () => {
    const userId = 'USER_ID'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    userParamsMock.mockReturnValue({})

    useSpaceMock.mockReturnValue({} as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useUserPresences>)

    renderHook(() => useSyncSpacePresence())

    expect(upsertSpacePresence).not.toBeCalled()
  })

  test('calls upsertSpacePresence with spaceId', () => {
    const userId = 'USER_ID'
    const spaceId = 'SPACE_ID'

    const space = {
      id: 'SPACE_UUID',
    }

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    userParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useUserPresencesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useUserPresences>)

    renderHook(() => useSyncSpacePresence())

    expect(useSpace).toBeCalledWith(spaceId)

    expect(useUserPresences).toBeCalledWith(space.id)
  })

  test('updates user status to ONLINE when user is present', async () => {
    const userId = 'USER_ID'
    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    userParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    const mutate = vi.fn()
    useUserPresencesMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useUserPresences>)

    renderHook(() => useSyncSpacePresence())

    expect(upsertSpacePresence).toBeCalledWith({
      userId,
      spaceId,
      status: 'ONLINE',
    })

    await waitFor(() => expect(mutate).toHaveBeenCalled())
  })

  test('updates user status to OFFLINE when user is not present', async () => {
    const userId = 'USER_ID'
    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    userParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    const mutate = vi.fn()
    useUserPresencesMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useUserPresences>)

    const { unmount } = renderHook(() => useSyncSpacePresence())

    unmount()

    expect(upsertSpacePresence).toHaveBeenCalledWith({
      userId,
      spaceId,
      status: 'OFFLINE',
    })

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(2))
  })

  test('updates user status to ONLINE every 15 seconds', async () => {
    vi.useFakeTimers()

    const userId = 'USER_ID'
    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue({
      data: { id: userId },
    } as unknown as ReturnType<typeof useSessionUser>)

    userParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: { id: spaceId },
    } as unknown as ReturnType<typeof useSpace>)

    const mutate = vi.fn()
    useUserPresencesMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useUserPresences>)

    const { unmount } = renderHook(() => useSyncSpacePresence())

    expect(upsertSpacePresence).toBeCalledTimes(1)

    vi.advanceTimersByTime(15000)

    expect(upsertSpacePresence).toBeCalledTimes(2)

    vi.advanceTimersByTime(15000)

    expect(upsertSpacePresence).toBeCalledTimes(3)

    unmount()

    expect(upsertSpacePresence).toBeCalledTimes(4)

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(4))

    vi.useRealTimers()
  })
})
