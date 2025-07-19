import { FC } from 'react'
import { DynamicIcon } from 'lucide-react/dynamic'
import VerticalList from '@/components/VerticalList'
import useAvailableDevices from './hooks/useAvailableDevices'
import DeviceList from './_components/DeviceList'

export const MEDIA_DEVICE_KIND = {
  video: 'videoinput',
  audio: 'audioinput',
} as const

export const KIND_LABEL = {
  video: 'camera',
  audio: 'microphone',
} as const

export const ICON_NAME = {
  video: 'video',
  audio: 'mic',
} as const

interface Props {
  onSelectDevice: (deviceId: string) => void
  kind: 'video' | 'audio'
  selectedDeviceId: string | null
}

const AvailableDevices: FC<Props> = ({
  onSelectDevice,
  selectedDeviceId,
  kind,
}) => {
  const { devices, isLoading } = useAvailableDevices(MEDIA_DEVICE_KIND[kind])

  return (
    <VerticalList>
      <VerticalList.Item placement="left">
        <DynamicIcon
          size={24}
          name={ICON_NAME[kind]}
          aria-label={KIND_LABEL[kind]}
        />
        <p className="px-3 font-bold">Select {KIND_LABEL[kind]}</p>
      </VerticalList.Item>
      <VerticalList.Divider />

      <DeviceList
        devices={devices}
        isLoading={isLoading}
        kind={KIND_LABEL[kind]}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={onSelectDevice}
      />
    </VerticalList>
  )
}

export default AvailableDevices
