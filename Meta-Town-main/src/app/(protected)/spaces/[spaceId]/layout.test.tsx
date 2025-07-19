import { useParams } from 'next/navigation'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useSpace from '@/hooks/useSpace'
import SpaceLayout from './layout'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

describe('SpaceLayout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders aboutToJoin page after loading', async () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    const user = userEvent.setup()

    render(<SpaceLayout>Hello world</SpaceLayout>)

    expect(useParams).toHaveBeenCalled()

    expect(useSpace).toHaveBeenCalledWith(spaceId)

    expect(
      screen.getByRole('button', { name: 'Join space' })
    ).toBeInTheDocument()

    expect(screen.queryByText('Hello world')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Join space' }))

    expect(
      screen.queryByRole('button', { name: 'Join space' })
    ).not.toBeInTheDocument()

    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  test('renders loading when space is loading', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: true,
    } as unknown as ReturnType<typeof useSpace>)

    render(<SpaceLayout>Hello world</SpaceLayout>)

    expect(
      screen.getByText('Please wait, we are syncing the metaverse...')
    ).toBeInTheDocument()

    expect(screen.queryByText('Hello world')).not.toBeInTheDocument()
  })

  test('returns 404 when space is not found', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSpace>)

    render(<SpaceLayout>Hello world</SpaceLayout>)

    expect(screen.getByText('404')).toBeInTheDocument()

    expect(screen.queryByText('Hello world')).not.toBeInTheDocument()
  })
})
