'use client'

import { FC } from 'react'
import IconButton from '@/components/IconButton'
import Logo from '@/components/Logo'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import navigate from '@/utils/navigate'
import Media from './_components/Media'
import Participants from './_components/Participants'
import EmojiTrigger from './_components/EmojiTrigger'
import Record from './_components/Record'

interface Props {
  isChatActive?: boolean
  isParticipantsActive?: boolean
  onChatClick: () => void
  onParticipantsClick: () => void
  mediasoupClient?: MediasoupClient | null
  recorder?: { stream: MediaStream } | null
}

const Footer: FC<Props> = ({
  isChatActive = false,
  isParticipantsActive = false,
  onChatClick,
  onParticipantsClick,
  mediasoupClient = undefined,
  recorder = undefined,
}) => (
  <footer className="flex w-full justify-between bg-gray-100 px-6 py-4">
    <div className="flex items-center">
      <Logo className="mr-12" />

      {mediasoupClient && (
        <div className="flex gap-2">
          <Media
            kind="video"
            camera={{
              width: 1280,
              height: 720,
              frameRate: 30,
            }}
            label="Camera"
            icon={(stream) =>
              stream
                ? { name: 'video', label: 'Turn Off Camera' }
                : { name: 'video-off', label: 'Turn On Camera' }
            }
            mediasoupClient={mediasoupClient}
          />
          <Media
            kind="audio"
            label="Microphone"
            icon={(stream) =>
              stream
                ? { name: 'mic', label: 'Turn Off Microphone' }
                : { name: 'mic-off', label: 'Turn On Microphone' }
            }
            mediasoupClient={mediasoupClient}
          />
          <Media
            kind="screen"
            display={{
              frameRate: 60,
            }}
            label="Screen Share"
            icon={(stream) =>
              stream
                ? { name: 'screen-share', label: 'Stop Screen Share' }
                : { name: 'screen-share-off', label: 'Start Screen Share' }
            }
            mediasoupClient={mediasoupClient}
          />
          {recorder && <Record stream={recorder.stream} />}
        </div>
      )}
      <div className="ml-12">
        <EmojiTrigger />
      </div>
    </div>

    <div className="flex gap-2">
      <IconButton
        tooltip={{ position: 'top' }}
        variant={isChatActive ? 'secondary' : 'naked'}
        icon="message-circle"
        label="Chat"
        onClick={onChatClick}
      />

      <Participants
        onClick={onParticipantsClick}
        isSideWindowOpen={isParticipantsActive}
      />

      <div className="ml-12">
        <IconButton
          onClick={() => navigate('/spaces')}
          tooltip={{ position: 'top-right' }}
          variant="secondary"
          icon="log-out"
          label="Leave Space"
        />
      </div>
    </div>
  </footer>
)

export default Footer
