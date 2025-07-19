import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import useStageConfig from '@/hooks/useStageConfig'
import CopyInviteLink from './CopyInviteLink'

vi.mock('@/hooks/useStageConfig')
const useStageConfigMock = vi.mocked(useStageConfig)

describe('CopyInviteLink', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('disables button if there is no stage config', async () => {
    useStageConfigMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useStageConfig>
    )

    const spaceId = 'SPACE_ID'
    render(<CopyInviteLink spaceId={spaceId} />)

    expect(useStageConfig).toHaveBeenCalledWith(spaceId)

    expect(
      await screen.findByRole('button', {
        name: 'Set up your Space before sharing the invite',
      })
    ).toBeDisabled()
  })

  test('copies share link to clipboard', async () => {
    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    const user = userEvent.setup()

    const writeTextMock = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValueOnce(undefined)

    render(<CopyInviteLink spaceId="SPACE_ID" />)

    await user.click(
      await screen.findByRole('button', { name: 'Copy invite link' })
    )

    expect(writeTextMock).toHaveBeenCalledWith(
      `${window.location.host}/spaces/SPACE_ID/join`
    )

    expect(
      await screen.findByRole('button', { name: 'Copied' })
    ).toBeInTheDocument()
  })

  test('resets copied tooltip after 2s', async () => {
    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    vi.useFakeTimers()

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    })

    render(<CopyInviteLink spaceId="SPACE_ID" />)

    await user.click(
      await screen.findByRole('button', { name: 'Copy invite link' })
    )

    expect(
      await screen.findByRole('button', { name: 'Copied' })
    ).toBeInTheDocument()

    await act(() => vi.advanceTimersByTime(2000))

    expect(
      await screen.findByRole('button', { name: 'Copy invite link' })
    ).toBeInTheDocument()

    vi.useRealTimers()
  })

  test('resets copied tooltip on mouse leave', async () => {
    useStageConfigMock.mockReturnValue({
      data: { id: 'STAGE_CONFIG_ID' },
    } as unknown as ReturnType<typeof useStageConfig>)

    const user = userEvent.setup()

    render(<CopyInviteLink spaceId="SPACE_ID" />)

    await user.click(
      await screen.findByRole('button', { name: 'Copy invite link' })
    )

    expect(
      await screen.findByRole('button', { name: 'Copied' })
    ).toBeInTheDocument()

    fireEvent.mouseLeave(await screen.findByRole('button', { name: 'Copied' }))

    expect(
      await screen.findByRole('button', { name: 'Copy invite link' })
    ).toBeInTheDocument()
  })
})
