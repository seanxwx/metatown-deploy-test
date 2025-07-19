import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import { VARIANT } from '@/components/Button'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useSpacePosition from '@/hooks/useSpacePosition'
import useStageConfig from '@/hooks/useStageConfig'
import useZones from '@/hooks/useZones'
import Configuration from './Configuration'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useStageConfig')
const useStageConfigMock = vi.mocked(useStageConfig)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpacePosition')
const useSpacePositionMock = vi.mocked(useSpacePosition)

vi.mock('@/hooks/useZones')
const useZonesMock = vi.mocked(useZones)

describe('Configuration', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('gets stage config by space id', () => {
    const spaceId = 'SPACE_ID'
    const space = { id: 'SPACE_UUID' }

    useParamsMock.mockReturnValue({ spaceId })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    render(<Configuration onClose={vi.fn()} onItemClick={vi.fn()} />)

    expect(useParams).toHaveBeenCalled()
    expect(useSpaceMock).toHaveBeenCalledWith(spaceId)
    expect(useStageConfigMock).toHaveBeenCalledWith(space.id)
  })

  test('renders draggable configuration dialog', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    render(<Configuration onClose={vi.fn()} onItemClick={vi.fn()} />)

    expect(
      screen.getByRole('dialog', { name: 'Configuration' })
    ).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByText('Config Space'), {
      target: screen.getByText('Config Space'),
    })

    fireEvent.mouseMove(document, {
      clientX: 50,
      clientY: 100,
    })

    fireEvent.mouseUp(document)

    expect(screen.getByRole('dialog', { name: 'Configuration' })).toHaveStyle(
      'left: 50px; top: 100px'
    )
  })

  test.each(['wood', 'grass'] as const)(
    'renders $s texture grounds config button',
    async (texture) => {
      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      useSessionUserMock.mockReturnValue({
        data: { id: 'USER_ID' },
      } as unknown as ReturnType<typeof useSessionUser>)

      useSpacePositionMock.mockReturnValue(
        {} as unknown as ReturnType<typeof useSpacePosition>
      )

      useSpaceMock.mockReturnValue({
        data: { id: 'SPACE_UUID' },
      } as unknown as ReturnType<typeof useSpace>)

      useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

      useStageConfigMock.mockReturnValue({
        data: { columns: 5, rows: 5 },
      } as unknown as ReturnType<typeof useStageConfig>)

      const onConfigItemClick = vi.fn()

      const user = userEvent.setup()

      render(
        <Configuration onClose={vi.fn()} onItemClick={onConfigItemClick} />
      )

      expect(
        screen.getByRole('button', { name: `Ground Floor - ${texture}` })
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: `Ground Floor - ${texture}` })
      ).toHaveClass(VARIANT.secondary)

      await user.click(
        screen.getByRole('button', { name: `Ground Floor - ${texture}` })
      )

      expect(onConfigItemClick).toHaveBeenCalledWith({
        type: 'grounds',
        texture,
      })
    }
  )

  test.each(['wood', 'grass'] as const)(
    'renders selected $s grounds config button',
    (texture) => {
      useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

      useSessionUserMock.mockReturnValue({
        data: { id: 'USER_ID' },
      } as unknown as ReturnType<typeof useSessionUser>)

      useSpacePositionMock.mockReturnValue(
        {} as unknown as ReturnType<typeof useSpacePosition>
      )

      useSpaceMock.mockReturnValue({
        data: { id: 'SPACE_UUID' },
      } as unknown as ReturnType<typeof useSpace>)

      useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

      useStageConfigMock.mockReturnValue({
        data: { columns: 5, rows: 5 },
      } as unknown as ReturnType<typeof useStageConfig>)

      render(
        <Configuration
          onClose={vi.fn()}
          onItemClick={vi.fn()}
          item={{ type: 'grounds', texture }}
        />
      )

      expect(
        screen.getByRole('button', { name: `Ground Floor - ${texture}` })
      ).toHaveClass(VARIANT.success)
    }
  )

  test('renders entry config button', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    const onConfigItemClick = vi.fn()

    render(<Configuration onClose={vi.fn()} onItemClick={onConfigItemClick} />)

    const user = userEvent.setup()

    expect(
      await screen.findByRole('button', { name: 'Entry' })
    ).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: 'Entry' })).toHaveClass(
      VARIANT.secondary
    )

    await user.click(await screen.findByRole('button', { name: 'Entry' }))

    expect(onConfigItemClick).toHaveBeenCalledWith({ type: 'entry' })
  })

  test('renders selected entry config button', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    render(
      <Configuration
        onClose={vi.fn()}
        onItemClick={vi.fn()}
        item={{ type: 'entry' }}
      />
    )

    expect(await screen.findByRole('button', { name: 'Entry' })).toHaveClass(
      VARIANT.success
    )
  })

  test('renders delete config button', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    const onConfigItemClick = vi.fn()

    render(<Configuration onClose={vi.fn()} onItemClick={onConfigItemClick} />)

    const user = userEvent.setup()

    expect(
      await screen.findByRole('button', { name: 'Delete' })
    ).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: 'Delete' })).toHaveClass(
      VARIANT.secondary
    )

    await user.click(await screen.findByRole('button', { name: 'Delete' }))

    expect(onConfigItemClick).toHaveBeenCalledWith({ type: 'delete' })
  })

  test('renders selected delete config button', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    render(
      <Configuration
        onClose={vi.fn()}
        onItemClick={vi.fn()}
        item={{ type: 'delete' }}
      />
    )

    expect(await screen.findByRole('button', { name: 'Delete' })).toHaveClass(
      VARIANT.danger
    )
  })

  test('calls onClose and set click item to null on click close button', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    const onClose = vi.fn()
    const onItemClick = vi.fn()

    const user = userEvent.setup()

    render(<Configuration onClose={onClose} onItemClick={onItemClick} />)

    await user.click(await screen.findByRole('button', { name: 'Close' }))

    expect(onItemClick).toHaveBeenCalledWith(null)
    expect(onClose).toHaveBeenCalled()
  })

  test('forces stage configuration when stage config is null', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    render(<Configuration onClose={vi.fn()} onItemClick={vi.fn()} />)

    expect(
      screen.getByText('Set the size of you space, You can change this later!')
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument()
  })

  test('disables config buttons when stage config is validating', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
      isValidating: true,
    } as unknown as ReturnType<typeof useStageConfig>)

    render(<Configuration onClose={vi.fn()} onItemClick={vi.fn()} />)

    expect(await screen.findByRole('button', { name: 'Entry' })).toBeDisabled()
  })

  test('does not render item config button when stage config is null', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    render(<Configuration onClose={vi.fn()} onItemClick={vi.fn()} />)

    expect(
      screen.queryByRole('button', { name: 'Wall' })
    ).not.toBeInTheDocument()
  })

  test('renders meeting zone', async () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    const zones = [
      { id: 'ZONE_1', name: 'Zone 1' },
      { id: 'ZONE_2', name: 'Zone 2' },
    ]

    useZonesMock.mockReturnValue({
      data: zones,
    } as unknown as ReturnType<typeof useZones>)

    const onItemClick = vi.fn()

    const user = userEvent.setup()

    render(
      <Configuration
        onClose={vi.fn()}
        item={{ type: 'zone', id: zones[1].id }}
        onItemClick={onItemClick}
      />
    )

    expect(
      await screen.findByRole('button', { name: zones[1].name })
    ).toHaveClass(VARIANT.success)

    await user.click(screen.getByRole('button', { name: zones[0].name }))

    await waitFor(() =>
      expect(onItemClick).toHaveBeenCalledWith({
        type: 'zone',
        id: zones[0].id,
      })
    )
  })

  test.each([
    {
      name: 'wall',
      item: { type: 'blocks', element: 'wall', direction: 'N' },
      expectedClick: { type: 'blocks', element: 'wall' },
    },
    {
      name: 'chair',
      item: { type: 'grounds', texture: 'chair', direction: 'N' },
      expectedClick: { type: 'grounds', texture: 'chair' },
    },
  ] as const)('renders asset $name', async ({ name, item, expectedClick }) => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useZonesMock.mockReturnValue({} as unknown as ReturnType<typeof useZones>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    useZonesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useZones>)

    const onItemClick = vi.fn()

    const user = userEvent.setup()

    render(
      <Configuration onClose={vi.fn()} item={item} onItemClick={onItemClick} />
    )

    expect(
      screen.getByRole('button', { name: `Asset: ${name} - N` })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Asset: ${name} - N` }))

    expect(onItemClick).toHaveBeenCalledWith({
      ...expectedClick,
      direction: 'N',
    })

    expect(
      screen.getByRole('button', { name: `Asset: ${name} - ${item.direction}` })
    ).toHaveClass(VARIANT.success)
  })
})
