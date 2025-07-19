import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { FC, useRef } from 'react'
import useProducers from '@/hooks/useProducers'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import Participant from './_components/Participant'
import Placeholder from './_components/Placeholder'
import useFocused from './_hooks/useFocused'
import useLayout from './_hooks/useLayout'
import usePromotedUsers from './_hooks/usePromotedUsers'
import useRegister from './_hooks/useRegister'
import getEnrichedParticipants from './utils/getEnrichedParticipants'
import getScreenProducer from './utils/getScreenProducer'

export const FOCUS = {
  Map: clsx('aspect-video w-1/4'),
  Meeting: clsx('size-full'),
}

interface Props {
  view: 'Map' | 'Meeting'
  users: string[]
  mediasoupClient: MediasoupClient
  recorder?: {
    addTrack: (track: MediaStreamTrack) => void
    removeTrack: (track: MediaStreamTrack) => void
  } | null
}

const CONTAINER = {
  column: clsx('flex-col'),
  row: clsx('flex-row'),
  grid: clsx('flex-col'),
}

const Layout: FC<Props> = ({
  view,
  users,
  mediasoupClient,
  recorder = null,
}) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: producers } = useProducers(spaceId)

  const participants = getEnrichedParticipants(users, producers)
  const screen = getScreenProducer(users, producers)

  const { register, ref: registerRef } = useRegister()

  const { focused, isTargetFocused, handleFocus } = useFocused(users, screen)

  const singleAxisLayout =
    (view === 'Map' ? 'column' : undefined) ?? (focused ? 'row' : undefined)

  const isShowScreenPlaceholder =
    screen && !isTargetFocused(screen.userId, 'screen')

  const extraCount = isShowScreenPlaceholder ? 1 : 0

  const layoutRef = useRef<HTMLDivElement>(null)

  const layout = useLayout(
    layoutRef,
    users.length + extraCount,
    singleAxisLayout
  )

  const length = layout.columns * layout.rows - extraCount

  const { promotedUsers, handleSpeak } = usePromotedUsers(
    users.filter((user) => !isTargetFocused(user, 'participant')),
    length
  )

  return (
    <>
      <div
        className={clsx(
          'flex min-h-0 flex-1 gap-4',
          CONTAINER[singleAxisLayout ?? 'grid']
        )}
        role="region"
        aria-label={view}
      >
        <div
          className="grid"
          ref={layoutRef}
          role="group"
          aria-label="Placeholders"
        >
          {isShowScreenPlaceholder && (
            <Placeholder
              id={`${screen.userId}:screen`}
              ref={registerRef}
              onFocus={() =>
                handleFocus({
                  userId: screen.userId,
                  kind: 'screen',
                })
              }
            />
          )}
          {promotedUsers.map((user) => (
            <Placeholder
              key={user}
              id={`${user}:participant`}
              ref={registerRef}
              onFocus={() =>
                handleFocus({
                  userId: user,
                  kind: 'participant',
                })
              }
            />
          ))}
        </div>
        {focused && (
          <div
            role="group"
            aria-label="Focused Placeholder"
            className={FOCUS[view]}
          >
            <Placeholder
              id={`${focused.userId}:${focused.kind}`}
              ref={registerRef}
              isFocused
              onFocus={() => handleFocus(null)}
            />
          </div>
        )}
      </div>
      {participants.map((participant) => (
        <Participant
          key={participant.id}
          producers={participant.producers}
          userId={participant.id}
          mediasoupClient={mediasoupClient}
          onSpeak={handleSpeak}
          recorder={recorder}
          register={{
            participant: register[`${participant.id}:participant`],
            audio: register[`${participant.id}:participant`],
            video: register[`${participant.id}:participant`],
            screen: register[`${participant.id}:screen`],
          }}
        />
      ))}
    </>
  )
}

export default Layout
