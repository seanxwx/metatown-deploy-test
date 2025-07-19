import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import upsertSpacePosition from '@/db/upsertSpacePosition'
import upsertStageConfig from '@/db/upsertStageConfig'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useSpacePosition from '@/hooks/useSpacePosition'
import useStageConfig from '@/hooks/useStageConfig'
import ConfigDimensionsForm from './ConfigDimensionsForm'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useStageConfig')
const useStageConfigMock = vi.mocked(useStageConfig)

vi.mock('@/hooks/useSpacePosition')
const useSpacePositionMock = vi.mocked(useSpacePosition)

vi.mock('@/db/upsertStageConfig')
const upsertStageConfigMock = vi.mocked(upsertStageConfig)

vi.mock('@/db/upsertSpacePosition')
const upsertSpacePositionMock = vi.mocked(upsertSpacePosition)

describe('configDimensions', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders form', () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({ spaceId })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    render(<ConfigDimensionsForm />)

    expect(useParamsMock).toHaveBeenCalled()
    expect(useSessionUserMock).toBeCalled()
    expect(useSpaceMock).toBeCalledWith(spaceId)
    expect(useStageConfigMock).toBeCalledWith(space.id)
    expect(useSpacePositionMock).toBeCalledWith(space.id)

    expect(screen.getByLabelText('Columns')).toBeInTheDocument()
    expect(screen.getByLabelText('Rows')).toBeInTheDocument()
  })

  test('renders null when space is not available', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({} as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    const { container } = render(<ConfigDimensionsForm />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders null when session user is not available', () => {
    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_UUID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSessionUser>
    )

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    const { container } = render(<ConfigDimensionsForm />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders form with default values', () => {
    const spaceId = 'SPACE_ID'
    useParamsMock.mockReturnValue({ spaceId })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpacePositionMock.mockReturnValue({
      data: { x: 0, y: 0, direction: 'N' },
    } as unknown as ReturnType<typeof useSpacePosition>)

    useStageConfigMock.mockReturnValue({
      data: { columns: 5, rows: 5 },
    } as unknown as ReturnType<typeof useStageConfig>)

    render(<ConfigDimensionsForm />)

    expect(screen.getByRole('spinbutton', { name: 'Columns' })).toHaveValue(5)
    expect(screen.getByRole('spinbutton', { name: 'Rows' })).toHaveValue(5)
  })

  test('calls upsertStageConfig on click set dimensions button', async () => {
    const user = userEvent.setup()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const mutateSpacePosition = vi.fn()
    useSpacePositionMock.mockReturnValue({
      data: { x: 0, y: 0, direction: 'N' },
      mutate: mutateSpacePosition,
    } as unknown as ReturnType<typeof useSpacePosition>)

    const mutateStageConfig = vi.fn()
    useStageConfigMock.mockReturnValue({
      data: {
        columns: 5,
        rows: 5,
        blocks: [
          { x: 1, y: 1, direction: 'N', element: 'wall' },
          { x: 5, y: 5, direction: 'N', element: 'wall' },
          { x: 6, y: 6, direction: 'N', element: 'wall' },
        ],
        entry: { x: 10, y: 10, direction: 'N' },
      },
      mutate: mutateStageConfig,
    } as unknown as ReturnType<typeof useStageConfig>)

    upsertStageConfigMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    render(<ConfigDimensionsForm />)

    await user.clear(screen.getByRole('spinbutton', { name: 'Columns' }))
    await user.clear(screen.getByRole('spinbutton', { name: 'Rows' }))

    await user.type(screen.getByRole('spinbutton', { name: 'Columns' }), '5')
    await user.type(screen.getByRole('spinbutton', { name: 'Rows' }), '5')

    await userEvent.click(
      screen.getByRole('button', { name: 'Set Dimensions' })
    )

    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled()

    await waitFor(() =>
      expect(upsertStageConfig).toHaveBeenCalledWith({
        spaceId: space.id,
        columns: 5,
        rows: 5,
        blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
        entry: { x: 0, y: 0, direction: 'N' },
      })
    )
    await waitFor(() => expect(mutateStageConfig).toHaveBeenCalled())

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Set Dimensions' })
      ).not.toBeDisabled()
    })

    expect(upsertSpacePosition).not.toHaveBeenCalled()
    expect(mutateSpacePosition).not.toHaveBeenCalled()
  })

  test('calls upsertStageConfig and upsertSpacePosition on click set dimensions button when there is no space position', async () => {
    const user = userEvent.setup()

    const sessionUser = { id: 'USER_ID' }
    useSessionUserMock.mockReturnValue({
      data: sessionUser,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    const space = { id: 'SPACE_UUID' }
    useSpaceMock.mockReturnValue({
      data: space,
    } as unknown as ReturnType<typeof useSpace>)

    const mutateSpacePosition = vi.fn()
    useSpacePositionMock.mockReturnValue({
      mutate: mutateSpacePosition,
    } as unknown as ReturnType<typeof useSpacePosition>)

    const mutateStageConfig = vi.fn()
    useStageConfigMock.mockReturnValue({
      mutate: mutateStageConfig,
    } as unknown as ReturnType<typeof useStageConfig>)

    upsertStageConfigMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    upsertSpacePositionMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    )

    render(<ConfigDimensionsForm />)

    await user.type(screen.getByRole('spinbutton', { name: 'Columns' }), '5')
    await user.type(screen.getByRole('spinbutton', { name: 'Rows' }), '5')

    await userEvent.click(
      screen.getByRole('button', { name: 'Set Dimensions' })
    )

    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled()

    await waitFor(() =>
      expect(upsertStageConfig).toHaveBeenCalledWith({
        spaceId: space.id,
        columns: 5,
        rows: 5,
        entry: { x: 0, y: 0, direction: 'N' },
      })
    )

    await waitFor(() => expect(mutateStageConfig).toHaveBeenCalled())

    await waitFor(() =>
      expect(upsertSpacePosition).toHaveBeenCalledWith({
        userId: sessionUser.id,
        spaceId: space.id,
        x: 0,
        y: 0,
        direction: 'N',
      })
    )

    await waitFor(() => expect(mutateSpacePosition).toHaveBeenCalled())

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Set Dimensions' })
      ).not.toBeDisabled()
    })
  })

  test('renders required error when columns is empty', async () => {
    const user = userEvent.setup()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    render(<ConfigDimensionsForm />)

    await user.type(screen.getByRole('spinbutton', { name: 'Rows' }), '5')

    await userEvent.click(
      screen.getByRole('button', { name: 'Set Dimensions' })
    )

    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  test('renders required error when rows is empty', async () => {
    const user = userEvent.setup()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    useSpacePositionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSpacePosition>
    )

    render(<ConfigDimensionsForm />)

    await user.type(screen.getByRole('spinbutton', { name: 'Columns' }), '5')

    await userEvent.click(
      screen.getByRole('button', { name: 'Set Dimensions' })
    )

    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
