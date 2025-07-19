import { render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import useUserPresences from '@/hooks/useUserPresences'
import useSessionUser from '@/hooks/useSessionUser'
import LastVisitedSpace from './LastVisitedSpace'

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('LastVisitedSpace', () => {
  test('renders last visit space', () => {
    const spaceId = '111'
    const name = 'Space01'
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [
        {
          id: 'ID',
          userId: 'USER_ID',
          spaceId,
          status: 'ONLINE',
          lastSeenAt: dayjs(),
        },
      ],
    } as unknown as ReturnType<typeof useUserPresences>)
    render(<LastVisitedSpace name={name} spaceId={spaceId} />)
    expect(useUserPresencesMock).toHaveBeenCalledWith(spaceId)
    expect(useSessionUser).toHaveBeenCalled()
    expect(screen.getByText('Space01')).toBeInTheDocument()
    expect(screen.getByText('a few seconds ago')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
