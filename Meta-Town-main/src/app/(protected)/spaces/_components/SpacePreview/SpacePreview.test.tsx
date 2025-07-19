import { render, screen } from '@testing-library/react'
import useUserPresences from '@/hooks/useUserPresences'
import useSessionUser from '@/hooks/useSessionUser'
import SpacePreview from './SpacePreview'

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('SpacePreview', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders Participant', () => {
    const spaceId = 'SPACE_ID'
    const user = { id: 'USER_ID', displayName: 'John Doe', avatar: 'dog' }

    useSessionUserMock.mockReturnValue({
      data: user,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          id: 'ID',
          userId: user.id,
          spaceId: 'SPACE_ID',
          status: 'OFFLINE',
          lastSeenAt: 'LAST_SEEN_AT',
        },
        {
          id: 'ID1',
          userId: 'USER_ID1',
          spaceId: 'SPACE_ID',
          status: 'ONLINE',
          lastSeenAt: 'LAST_SEEN_AT',
        },
        {
          id: 'ID2',
          userId: 'USER_ID2',
          spaceId: 'SPACE_ID',
          status: 'ONLINE',
          lastSeenAt: 'LAST_SEEN_AT',
        },
        {
          id: 'ID3',
          userId: 'USER_ID3',
          spaceId: 'SPACE_ID',
          status: 'OFFLINE',
          lastSeenAt: 'LAST_SEEN_AT',
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)

    render(<SpacePreview name="Test Name" spaceId={spaceId} />)

    expect(useUserPresencesMock).toBeCalledWith(spaceId)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('renders Info', async () => {
    vi.useFakeTimers()

    const lastSeenAt = new Date(Date.now() - 30000)

    useSessionUserMock.mockReturnValue({
      data: {
        id: '1',
      },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockImplementation((spaceId) => {
      if (spaceId === 'SPACE_ID') {
        return {
          data: [
            {
              userId: '1',
              spaceId,
              lastSeenAt,
            },
          ],
        } as unknown as ReturnType<typeof useUserPresences>
      }

      return {
        data: null,
      } as unknown as ReturnType<typeof useUserPresences>
    })

    const spaceId = 'SPACE_ID'
    render(<SpacePreview name="Test Name" spaceId={spaceId} />)

    expect(
      await screen.findByRole('button', { name: 'Options' })
    ).toBeInTheDocument()
    expect(screen.getByText('Test Name')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Placeholder/i })).toHaveAttribute(
      'href',
      `/spaces/${spaceId}`
    )

    expect(screen.getByRole('time', { name: 'Last seen at' })).toContainHTML(
      'a few seconds ago'
    )

    vi.useRealTimers()
  })

  test('renders Preview', () => {
    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue({
      data: {
        id: '1',
      },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    render(<SpacePreview name="Test Name" spaceId={spaceId} />)

    expect(screen.getByRole('link', { name: /Placeholder/i })).toHaveAttribute(
      'href',
      `/spaces/${spaceId}`
    )
    expect(screen.getByText('Placeholder')).toBeInTheDocument()
  })
})
