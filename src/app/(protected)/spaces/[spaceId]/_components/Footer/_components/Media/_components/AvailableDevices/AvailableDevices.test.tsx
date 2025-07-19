import { render, screen } from '@testing-library/react'
import useAvailableDevices from './hooks/useAvailableDevices'
import AvailableDevices from './AvailableDevices'

vi.mock('./hooks/useAvailableDevices')
const useAvailableDevicesMock = vi.mocked(useAvailableDevices)

describe('AvailableDevices', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each(['video', 'audio'] as const)(
    'renders select %s devices label and icon',
    async (kind) => {
      useAvailableDevicesMock.mockReturnValue({
        devices: [],
        isLoading: true,
      }) as unknown as ReturnType<typeof useAvailableDevices>

      const KIND_LABEL = {
        video: 'camera',
        audio: 'microphone',
      } as const

      render(
        <AvailableDevices
          onSelectDevice={vi.fn()}
          selectedDeviceId={null}
          kind={kind}
        />
      )

      expect(await screen.findByLabelText(KIND_LABEL[kind])).toBeInTheDocument()

      expect(screen.getByText(`Select ${KIND_LABEL[kind]}`)).toBeInTheDocument()
    }
  )

  test('renders devices list', () => {
    useAvailableDevicesMock.mockReturnValue({
      devices: [
        {
          deviceId: 'DEVICE_ID_1',
          kind: 'videoinput',
          label: 'CAMERA',
          groupId: 'GROUP_1',
        } as MediaDeviceInfo,
      ],
      isLoading: false,
    }) as unknown as ReturnType<typeof useAvailableDevices>

    render(
      <AvailableDevices
        onSelectDevice={vi.fn()}
        selectedDeviceId={null}
        kind="video"
      />
    )

    expect(screen.getByRole('button', { name: 'CAMERA' })).toBeInTheDocument()
  })

  test.each(['video', 'audio'] as const)(
    'calls useAvailableDevices with correct kind for %s',
    (kind) => {
      const MEDIA_DEVICE_KIND = {
        video: 'videoinput',
        audio: 'audioinput',
      } as const

      useAvailableDevicesMock.mockReturnValue({
        devices: [],
        isLoading: false,
      }) as unknown as ReturnType<typeof useAvailableDevices>

      render(
        <AvailableDevices
          onSelectDevice={vi.fn()}
          selectedDeviceId={null}
          kind={kind}
        />
      )

      expect(useAvailableDevicesMock).toHaveBeenCalledWith(
        MEDIA_DEVICE_KIND[kind]
      )
    }
  )
})
