import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectableDevice from './SelectableDevice'

describe('SelectableMediaDevice', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders device label', () => {
    const label = 'CAMERA'

    const device = {
      deviceId: 'DEVICE_ID',
      kind: 'videoinput',
      label,
      groupId: 'GROUP_ID',
    } as MediaDeviceInfo

    render(<SelectableDevice device={device} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  })

  test('renders checkmark when isSelected is true', () => {
    const label = 'CAMERA'

    const device = {
      deviceId: 'DEVICE_ID',
      kind: 'videoinput',
      label,
      groupId: 'GROUP_ID',
    } as MediaDeviceInfo

    render(<SelectableDevice device={device} isSelected onSelect={vi.fn()} />)

    expect(
      screen.getByLabelText(`Device ${label} selected`)
    ).toBeInTheDocument()
  })

  test('does not render checkmark when isSelected is false', () => {
    const label = 'CAMERA'

    const device = {
      deviceId: 'DEVICE_ID',
      kind: 'videoinput',
      label,
      groupId: 'GROUP_ID',
    } as MediaDeviceInfo

    render(<SelectableDevice device={device} onSelect={vi.fn()} />)

    expect(
      screen.queryByLabelText(`Device ${label} selected`)
    ).not.toBeInTheDocument()
  })

  test('calls onSelect with deviceId when device button is clicked', async () => {
    const deviceId = 'DEVICE_ID'
    const label = 'CAMERA'

    const device = {
      deviceId,
      kind: 'videoinput',
      label,
      groupId: 'GROUP_ID',
    } as MediaDeviceInfo

    const onSelect = vi.fn()
    const user = userEvent.setup()

    render(<SelectableDevice device={device} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: label }))

    expect(onSelect).toHaveBeenCalledWith(deviceId)
  })
})
