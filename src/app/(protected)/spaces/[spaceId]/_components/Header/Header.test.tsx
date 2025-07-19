import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { VARIANT } from '@/components/Button'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useSessionUser from '@/hooks/useSessionUser'
import useUserPresences from '@/hooks/useUserPresences'
import useSpace from '@/hooks/useSpace'
import useStageConfig from '@/hooks/useStageConfig'
import useLastVisitedSpaces from '@/hooks/useLastVisitedSpaces'
import Header from './Header'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useStageConfig')
const useStageConfigMock = vi.mocked(useStageConfig)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useLastVisitedSpaces')
const useLastVisitedSpacesMock = vi.mocked(useLastVisitedSpaces)

describe('Header', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders copy link button', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    const space = { id: 'SPACE_UUID', name: 'All-Hands' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [{ id: 'SPACE_ID', name: 'All-Hands' }],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Header onEditSpace={vi.fn()} />)

    expect(useStageConfig).toBeCalledWith(space.id)

    expect(
      await screen.findByRole('button', { name: 'Copy invite link' })
    ).toBeInTheDocument()
  })

  test('renders null if there is no space', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({} as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [{ id: 'SPACE_ID', name: 'All-Hands' }],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    const { container } = render(<Header onEditSpace={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders My Spaces button with the space name', () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({ spaceId })

    const space = { id: 'SPACE_UUID', name: 'All-Hands' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [{ id: 'SPACE_ID', name: 'All-Hands' }],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Header onEditSpace={vi.fn()} />)

    expect(useParams).toBeCalledWith()

    expect(useSpace).toBeCalledWith(spaceId)

    expect(screen.getByRole('button', { name: space.name })).toBeInTheDocument()
  })

  test('toggles lastVisitedSpaces dropdown when click My Spaces button', async () => {
    const spaceId = 'SPACE_ID03'
    useParamsMock.mockReturnValue({ spaceId })

    const lastVisitedSpaces = [
      {
        id: 'SPACE_ID01',
        name: 'JOINED SPACES01',
        lastSeenAt: '2021-01-01T00:00:00.000Z',
      },
      {
        id: 'SPACE_ID02',
        name: 'JOINED SPACES02',
        lastSeenAt: '2022-01-01T00:00:00.000Z',
      },
      {
        id: 'SPACE_ID03',
        name: 'VISITED OWNED SPACE01',
      },
    ]

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID1' },
    } as unknown as ReturnType<typeof useSessionUser>)

    const space = { id: spaceId, name: 'All-Hands' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: lastVisitedSpaces,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const user = userEvent.setup()
    render(<Header onEditSpace={vi.fn()} />)
    expect(await screen.findByRole('button', { name: space.name })).toHaveClass(
      VARIANT.underline
    )
    await user.click(screen.getByRole('button', { name: space.name }))
    expect(await screen.findByRole('button', { name: space.name })).toHaveClass(
      VARIANT.secondary
    )
    expect(useLastVisitedSpacesMock).toHaveBeenCalled()
    expect(screen.getByText(lastVisitedSpaces[0].name)).toBeInTheDocument()
    expect(screen.getByText(lastVisitedSpaces[1].name)).toBeInTheDocument()
    expect(screen.getByText(lastVisitedSpaces[2].name)).toBeInTheDocument()
  })

  test('renders Loading when useLastVisitedSpaces is loading', async () => {
    useParamsMock.mockReturnValue({ spaceID: 'SPACE_ID' })
    const space = { id: 'SPACE_ID', name: 'All-Hands' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: {},
      isLoading: true,
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const user = userEvent.setup()
    render(<Header onEditSpace={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: space.name }))
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  test('calls onEditSpace when edit space button is clicked', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    const space = { id: 'SPACE_UUID', name: 'All-Hands' }

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useOwnedSpacesMock.mockReturnValue({
      data: [space],
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [{ id: 'SPACE_ID', name: 'All-Hands' }],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    const onEditSpace = vi.fn()

    const user = userEvent.setup()

    render(<Header onEditSpace={onEditSpace} />)

    expect(
      await screen.findByRole('button', { name: 'More options' })
    ).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'More options' })
    )

    expect(
      screen.getByRole('button', { name: 'Edit Space' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit Space' }))

    expect(onEditSpace).toHaveBeenCalled()
  })

  test('renders change space name modal when change space name button is clicked', async () => {
    const user = userEvent.setup()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    const space = { id: 'SPACE_UUID', name: 'All-Hands' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useOwnedSpacesMock.mockReturnValue({
      data: [space],
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    useLastVisitedSpacesMock.mockReturnValue({
      data: [{ id: 'SPACE_ID', name: 'All-Hands' }],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Header onEditSpace={vi.fn()} />)

    expect(
      await screen.findByRole('button', { name: 'More options' })
    ).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'More options' })
    )

    await user.click(screen.getByRole('button', { name: 'Change Space name' }))

    expect(screen.getByRole('dialog', { name: 'Modal' })).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Change Space name' })
    ).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: 'Space name' })).toHaveValue(
      space.name
    )

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(
      screen.queryByRole('dialog', { name: 'Modal' })
    ).not.toBeInTheDocument()
  })

  test('does not render more options button if user is not the owner', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useOwnedSpacesMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useOwnedSpaces>
    )

    useLastVisitedSpacesMock.mockReturnValue({
      data: [{ id: 'SPACE_ID', name: 'All-Hands' }],
    } as unknown as ReturnType<typeof useLastVisitedSpaces>)

    render(<Header onEditSpace={vi.fn()} />)

    expect(useOwnedSpaces).toHaveBeenCalled()

    expect(
      screen.queryByRole('button', { name: 'More options' })
    ).not.toBeInTheDocument()
  })
})
