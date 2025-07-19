import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeviceList from './DeviceList'

describe('DeviceList', () => {
  test.each(['camera', 'microphone'] as const)(
    'renders %s device loadings state',
    (kind) => {
      render(
        <DeviceList
          devices={[]}
          isLoading
          kind={kind}
          selectedDeviceId={null}
          onSelectDevice={vi.fn()}
        />
      )

      expect(screen.getByText(`Loading ${kind} devices...`)).toBeInTheDocument()
    }
  )

  test.each(['camera', 'microphone'] as const)(
    'renders no %s devices found',
    (kind) => {
      render(
        <DeviceList
          devices={[]}
          kind={kind}
          selectedDeviceId={null}
          onSelectDevice={vi.fn()}
        />
      )

      expect(screen.getByText(`No ${kind} devices found.`)).toBeInTheDocument()
    }
  )

  test('renders list of available devices', () => {
    const deviceLabel_1 = 'LABEL_1'
    const deviceLabel_2 = 'LABEL_2'

    const devices: MediaDeviceInfo[] = [
      {
        deviceId: 'CAMERA_ID_1',
        kind: 'videoinput',
        label: deviceLabel_1,
        groupId: `GROUP_1`,
        toJSON: () => ({}),
      },
      {
        deviceId: 'CAMERA_ID_2',
        kind: 'videoinput',
        label: deviceLabel_2,
        groupId: `GROUP_2`,
        toJSON: () => ({}),
      },
    ]

    render(
      <DeviceList
        devices={devices}
        kind="camera"
        selectedDeviceId={null}
        onSelectDevice={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: deviceLabel_1 })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: deviceLabel_2 })
    ).toBeInTheDocument()
  })

  test('calls onSelectDevice with deviceId when device button is clicked', async () => {
    const deviceId = 'CAMERA_ID'
    const label = 'LABEL'

    const devices: MediaDeviceInfo[] = [
      {
        deviceId,
        kind: 'videoinput',
        label,
        groupId: `GROUP`,
        toJSON: () => ({}),
      },
    ]

    const onSelectDevice = vi.fn()
    const user = userEvent.setup()

    render(
      <DeviceList
        devices={devices}
        kind="camera"
        selectedDeviceId={null}
        onSelectDevice={onSelectDevice}
      />
    )

    await user.click(screen.getByRole('button', { name: label }))

    expect(onSelectDevice).toHaveBeenCalledWith(deviceId)
  })
})
