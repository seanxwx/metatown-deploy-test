import { keyBy } from 'lodash'
import { FC } from 'react'
import { createPortal } from 'react-dom'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import Audio from './_components/Audio'
import EmojiReaction from './_components/EmojiReaction'
import Screen from './_components/Screen'
import Video from './_components/Video'

interface Producer {
  id: string
  producerId: string
  userId: string
  state: 'ACTIVE' | 'PAUSED'
  kind: 'video' | 'audio' | 'screen'
}

interface Props {
  producers?: Producer[]
  userId: string
  mediasoupClient: MediasoupClient
  recorder?: {
    addTrack: (track: MediaStreamTrack) => void
    removeTrack: (track: MediaStreamTrack) => void
  } | null
  register: {
    video: HTMLElement | null
    screen: HTMLElement | null
    audio: HTMLElement | null
    participant: HTMLElement | null
  }
  onSpeak: (userId: string) => void
}

const Participant: FC<Props> = ({
  producers = [],
  userId,
  mediasoupClient,
  recorder = undefined,
  register,
  onSpeak,
}) => {
  const producer = keyBy<Producer | undefined>(producers, 'kind')

  return (
    <>
      {register.participant &&
        createPortal(<EmojiReaction userId={userId} />, register.participant)}

      <Audio
        mediasoupClient={mediasoupClient}
        recorder={recorder}
        producer={producer.audio}
        userId={userId}
        portal={register.audio}
        onSpeak={onSpeak}
      />

      <Video
        mediasoupClient={mediasoupClient}
        producer={producer.video}
        userId={userId}
        portal={register.video}
      />

      <Screen
        mediasoupClient={mediasoupClient}
        recorder={recorder}
        producer={producer.screen}
        userId={userId}
        portal={register.screen}
      />
    </>
  )
}

export default Participant
