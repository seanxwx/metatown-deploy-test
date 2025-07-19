import { Mic, MicOff } from 'lucide-react'
import { FC } from 'react'

interface Props {
  isMuted?: boolean
}

const MuteIndicator: FC<Props> = ({ isMuted = false }) => {
  if (!isMuted) {
    return <Mic size={20} className="text-green-500" aria-label="Unmuted" />
  }

  return <MicOff size={20} className="text-rose-500" aria-label="Muted" />
}

export default MuteIndicator
