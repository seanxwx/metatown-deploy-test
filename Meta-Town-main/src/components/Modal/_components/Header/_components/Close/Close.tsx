import { FC } from 'react'
import IconButton from '@/components/IconButton'

interface Props {
  onClose: () => void
}

const Close: FC<Props> = ({ onClose }) => (
  <IconButton
    label="Close"
    icon="x"
    variant="naked"
    size="small"
    onClick={onClose}
  />
)

export default Close
