import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { VARIANT } from '@/components/Button'
import upsertZone from '@/db/upsertZone'
import useSpace from '@/hooks/useSpace'
import useZones from '@/hooks/useZones'
import getDeterministicColorStyle from '@/utils/getDeterministicColorStyle'
import MeetingZone from './MeetingZone'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useZones')
const useZonesMock = vi.mocked(useZones)

vi.mock('@/db/upsertZone')
const upsertZoneMock = vi.mocked(upsertZone)

describe('MeetingZone', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders nothing if space is not found', () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useZones>)

    const { container } = render(<MeetingZone onSelect={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })

  test('creates zone and calls onSelect on submit form', async () => {
    const onSelect = vi.fn()
    const name = 'Test Meeting Zone'

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const mutate = vi.fn()
    useZonesMock.mockReturnValue({
      data: [],
      mutate,
    } as unknown as ReturnType<typeof useZones>)

    const zone = { id: 'ZONE_ID' }
    upsertZoneMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(zone), 50))
    )

    const user = userEvent.setup()

    render(<MeetingZone onSelect={onSelect} />)

    expect(useParamsMock).toHaveBeenCalled()
    expect(useSpaceMock).toHaveBeenCalledWith(spaceId)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), name)

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(upsertZone).toHaveBeenCalledWith({
      spaceId: space.id,
      name,
      type: 'MEETING',
    })

    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled()

    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(zone.id))

    expect(mutate).toHaveBeenCalled()

    expect(screen.getByRole('button', { name: 'Create' })).not.toBeDisabled()
  })

  test('does not reset and select zone if upsertZone fails', async () => {
    const onSelect = vi.fn()
    const name = 'Test Meeting Zone'

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const mutate = vi.fn()
    useZonesMock.mockReturnValue({
      data: [],
      mutate,
    } as unknown as ReturnType<typeof useZones>)

    const user = userEvent.setup()

    render(<MeetingZone onSelect={onSelect} />)

    expect(useParamsMock).toHaveBeenCalled()
    expect(useSpaceMock).toHaveBeenCalledWith(spaceId)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), name)

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(upsertZone).toHaveBeenCalledWith({
      spaceId: space.id,
      name,
      type: 'MEETING',
    })

    expect(mutate).toHaveBeenCalled()

    expect(onSelect).not.toHaveBeenCalled()

    expect(screen.getByRole('button', { name: 'Create' })).not.toBeDisabled()
  })

  test('renders size filed', async () => {
    const onSelect = vi.fn()
    const name = 'Test Meeting Zone'
    const size = 10

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({
      data: [],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useZones>)

    const zone = { id: 'ZONE_ID' }
    upsertZoneMock.mockResolvedValue(zone)

    const user = userEvent.setup()

    render(<MeetingZone onSelect={onSelect} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), name)

    expect(screen.queryByLabelText('Size')).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Add Size' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Size' }))

    expect(screen.getByLabelText('Size')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Size'), String(size))

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(upsertZone).toHaveBeenCalledWith({
      spaceId: space.id,
      name,
      type: 'MEETING',
      size,
    })

    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(zone.id))
  })

  test('removes size field', async () => {
    const onSelect = vi.fn()

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({
      data: [],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useZones>)

    const user = userEvent.setup()

    render(<MeetingZone onSelect={onSelect} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Size' }))

    expect(screen.getByLabelText('Size')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove size' }))

    expect(screen.queryByLabelText('Size')).not.toBeInTheDocument()
  })

  test('renders error message', async () => {
    const onSelect = vi.fn()

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({
      data: [],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useZones>)

    const user = userEvent.setup()

    render(<MeetingZone onSelect={onSelect} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(screen.getByText('Required')).toBeInTheDocument()

    expect(upsertZone).not.toHaveBeenCalled()
  })

  test('does not render zones button if no zones', () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({
      data: [],
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useZones>)

    render(<MeetingZone onSelect={vi.fn()} />)

    expect(
      screen.queryByRole('group', { name: 'Zones' })
    ).not.toBeInTheDocument()
  })

  test('renders zone buttons', async () => {
    const onSelect = vi.fn()

    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({
      spaceId,
    })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const zones = [
      { id: 'ZONE_1', name: 'Zone 1' },
      { id: 'ZONE_2', name: 'Zone 2' },
    ]
    useZonesMock.mockReturnValue({
      data: zones,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useZones>)

    const user = userEvent.setup()

    render(<MeetingZone selectedId={zones[1].id} onSelect={onSelect} />)

    expect(screen.getByRole('group', { name: 'Zones' })).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: zones[0].name })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: zones[0].name })).toHaveClass(
      VARIANT.secondary
    )

    expect(
      screen.getByRole('button', { name: zones[1].name })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: zones[1].name })).toHaveClass(
      VARIANT.success
    )

    await user.click(screen.getByRole('button', { name: zones[0].name }))
    expect(onSelect).toHaveBeenCalledWith(zones[0].id)
  })

  test('renders zone buttons with deterministic color when selected', () => {
    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      data: 'SPACE_ID',
    } as unknown as ReturnType<typeof useSpace>)

    const zones = [
      { id: 'ZONE_1', name: 'Zone 1' },
      { id: 'ZONE_2', name: 'Zone 2' },
    ]
    useZonesMock.mockReturnValue({
      data: zones,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useZones>)

    render(<MeetingZone selectedId={zones[0].id} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: zones[0].name })).toHaveStyle({
      background: getDeterministicColorStyle(zones[0].id).backgroundColor,
    })

    expect(screen.getByRole('button', { name: zones[1].name })).not.toHaveStyle(
      {
        background: getDeterministicColorStyle(zones[1].id).backgroundColor,
      }
    )
  })
})
