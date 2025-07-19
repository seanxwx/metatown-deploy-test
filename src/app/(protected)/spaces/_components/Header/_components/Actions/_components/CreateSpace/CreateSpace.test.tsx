import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useOwnedSpaces from '@/hooks/useOwnedSpaces'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import upsertSpace from '@/db/upsertSpace'
import navigate from '@/utils/navigate'
import CreateSpace from './CreateSpace'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useOwnedSpaces')
const useOwnedSpacesMock = vi.mocked(useOwnedSpaces)

vi.mock('@/db/upsertSpace')
const upsertSpaceMock = vi.mocked(upsertSpace)

vi.mock('@/utils/navigate')

describe('CreateSpace', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders button', () => {
    render(<CreateSpace />)

    expect(
      screen.getByRole('button', { name: 'Create Spaces' })
    ).toBeInTheDocument()
  })

  test('does not render modal initially', () => {
    render(<CreateSpace />)

    expect(
      screen.queryByRole('dialog', { name: 'Modal' })
    ).not.toBeInTheDocument()
  })

  test('opens modal when button is clicked', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    render(<CreateSpace />)

    await userEvent.click(screen.getByRole('button', { name: 'Create Spaces' }))

    expect(screen.getByRole('dialog', { name: 'Modal' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Create a new Space' })
    ).toBeInTheDocument()
  })

  test('closes the modal when button is clicked', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    render(<CreateSpace />)

    await userEvent.click(screen.getByRole('button', { name: 'Create Spaces' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument()
  })

  test('closes modal when form submit successful', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    upsertSpaceMock.mockResolvedValue({ id: 'UPSERT_SPACE_ID' })

    const user = userEvent.setup()

    render(<CreateSpace />)

    await user.click(screen.getByRole('button', { name: 'Create Spaces' }))

    await user.type(screen.getByRole('textbox', { name: 'Space name' }), 'test')
    await user.click(screen.getByRole('button', { name: 'Create Space' }))

    expect(screen.queryByText('Create a new space')).not.toBeInTheDocument()
  })

  test('redirects to new space page after creating', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    const upsertedSpace = { id: 'UPSERT_SPACE_ID' }
    upsertSpaceMock.mockResolvedValue(upsertedSpace)

    const user = userEvent.setup()

    render(<CreateSpace />)

    await userEvent.click(screen.getByRole('button', { name: 'Create Spaces' }))

    await user.type(
      screen.getByRole('textbox', { name: 'Space name' }),
      'UPSERT_SPACE_NAME'
    )

    await user.click(screen.getByRole('button', { name: 'Create Space' }))

    expect(navigate).toHaveBeenCalledWith(`/spaces/${upsertedSpace.id}`)
  })

  test('does not redirect to new space page after creating if upsertedSpace is null', async () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
    } as unknown as ReturnType<typeof useSessionUser>)

    useSpaceMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSpace>)

    useOwnedSpacesMock.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useOwnedSpaces>)

    upsertSpaceMock.mockResolvedValue(null)

    const user = userEvent.setup()

    render(<CreateSpace />)

    await userEvent.click(screen.getByRole('button', { name: 'Create Spaces' }))

    await user.type(
      screen.getByRole('textbox', { name: 'Space name' }),
      'UPSERT_SPACE_NAME'
    )

    await user.click(screen.getByRole('button', { name: 'Create Space' }))

    expect(navigate).not.toHaveBeenCalled()
  })
})
