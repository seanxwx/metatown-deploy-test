import { FC } from 'react'
import VerticalList from '@/components/VerticalList'
import SelectableDevice from './_components/SelectableDevice'

interface Props {
  devices: MediaDeviceInfo[]
  isLoading?: boolean
  kind: 'camera' | 'microphone'
  selectedDeviceId: string | null
  onSelectDevice: (deviceId: string) => void
}

const DeviceList: FC<Props> = ({
  devices,
  isLoading = false,
  kind,
  selectedDeviceId,
  onSelectDevice,
}) => {
  if (isLoading) {
    return (
      <VerticalList.Item placement="left">
        <p>Loading {kind} devices...</p>
      </VerticalList.Item>
    )
  }

  if (devices.length === 0) {
    return (
      <VerticalList.Item placement="left">
        <p>No {kind} devices found.</p>
      </VerticalList.Item>
    )
  }

  return (
    <>
      {devices.map((device) => (
        <VerticalList.Item key={device.deviceId} placement="left">
          <SelectableDevice
            device={device}
            isSelected={device.deviceId === selectedDeviceId}
            onSelect={onSelectDevice}
          />
        </VerticalList.Item>
      ))}
    </>
  )
}

export default DeviceList
