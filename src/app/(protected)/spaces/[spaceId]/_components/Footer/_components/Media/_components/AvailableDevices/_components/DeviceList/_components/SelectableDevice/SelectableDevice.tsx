import { FC } from 'react'
import { Check } from 'lucide-react'
import Button from '@/components/Button'

interface Props {
  device: MediaDeviceInfo
  isSelected?: boolean
  onSelect: (deviceId: string) => void
}

const SelectableDevice: FC<Props> = ({
  device,
  isSelected = false,
  onSelect,
}) => (
  <Button
    onClick={() => onSelect(device.deviceId)}
    variant="naked"
    className="flex w-full items-center justify-between"
  >
    <p className="mr-4 truncate">{device.label}</p>
    {isSelected && (
      <div className="rounded-full bg-green-400 p-1">
        <Check
          size={14}
          className="text-white"
          aria-label={`Device ${device.label} selected`}
        />
      </div>
    )}
  </Button>
)

export default SelectableDevice
