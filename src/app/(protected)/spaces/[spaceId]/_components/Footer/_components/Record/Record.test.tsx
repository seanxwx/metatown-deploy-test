import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VARIANT } from '@/components/Button'
import createSegmentRecorder from './_utils/createSegmentRecorder'
import Record from './Record'

vi.mock('./_utils/createSegmentRecorder')
const createSegmentRecorderMock = vi.mocked(createSegmentRecorder)

describe('Record', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('starts recording', async () => {
    const stream = {} as MediaStream

    const user = userEvent.setup()

    const recorder = { start: vi.fn(), stop: vi.fn() }
    createSegmentRecorderMock.mockReturnValue(recorder)

    const { unmount } = render(<Record stream={stream} />)

    expect(
      await screen.findByRole('button', { name: 'Start Recording' })
    ).toHaveClass(VARIANT.danger)

    await user.click(
      await screen.findByRole('button', { name: 'Start Recording' })
    )

    expect(recorder.start).toHaveBeenCalledWith(30)

    unmount()

    expect(recorder.stop).toHaveBeenCalled()
  })

  test('stops recording', async () => {
    const stream = {} as MediaStream

    const user = userEvent.setup()

    const recorder = { start: vi.fn(), stop: vi.fn() }
    createSegmentRecorderMock.mockReturnValue(recorder)

    render(<Record stream={stream} />)

    await user.click(
      await screen.findByRole('button', { name: 'Start Recording' })
    )

    expect(
      await screen.findByRole('button', { name: 'Stop Recording' })
    ).toHaveClass(VARIANT.success)

    await user.click(
      await screen.findByRole('button', { name: 'Stop Recording' })
    )

    expect(recorder.stop).toHaveBeenCalled()

    expect(
      await screen.findByRole('button', { name: 'Start Recording' })
    ).toHaveClass(VARIANT.danger)
  })

  test('does not start recording if start recorder throws', async () => {
    const stream = {} as MediaStream

    const user = userEvent.setup()

    const recorder = {
      start: vi.fn().mockRejectedValue(new Error()),
      stop: vi.fn(),
    }
    createSegmentRecorderMock.mockReturnValue(recorder)

    render(<Record stream={stream} />)

    await user.click(
      await screen.findByRole('button', { name: 'Start Recording' })
    )

    expect(
      screen.queryByRole('button', { name: 'Stop Recording' })
    ).not.toBeInTheDocument()
  })

  test('does not stop recording if can not create segment recorder', async () => {
    const stream = {} as MediaStream

    const user = userEvent.setup()

    createSegmentRecorderMock.mockReturnValue(null)

    render(<Record stream={stream} />)

    await user.click(
      await screen.findByRole('button', { name: 'Start Recording' })
    )

    expect(
      screen.queryByRole('button', { name: 'Stop Recording' })
    ).not.toBeInTheDocument()
  })
})
