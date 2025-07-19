'use client'

import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { ConfigItem } from '@/app/types'
import GlobalLoading from '@/components/GlobalLoading'
import useMediasoupClient from '@/hooks/useMediasoupClient'
import useRecorder from '@/hooks/useRecorder'
import useSpace from '@/hooks/useSpace'
import useSpacePosition from '@/hooks/useSpacePosition'
import useStageConfig from '@/hooks/useStageConfig'
import ChatSideWindow from './_components/ChatSideWindow'
import Configuration from './_components/Configuration'
import Footer from './_components/Footer'
import Header from './_components/Header'
import Meeting from './_components/Meeting'
import ParticipantsSideWindow from './_components/ParticipantsSideWindow'
import Stage from './_components/Stage'
import useSyncSpacePresence from './_hooks/useSyncSpacePresence'

const Space: FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)

  const { data: stageConfig, isLoading: isStageConfigLoading } = useStageConfig(
    space?.id
  )

  const { data: userPosition, isLoading: isUserPositionLoading } =
    useSpacePosition(space?.id)

  useSyncSpacePresence()

  const [sideWindow, setSideWindow] = useState<'chat' | 'participants' | null>(
    null
  )

  const [isStageConfigurationOpen, setIsStageConfigurationOpen] =
    useState(false)

  const mediasoupClient = useMediasoupClient()
  const recorder = useRecorder()

  const [configItem, setConfigItem] = useState<ConfigItem | null>(null)

  if (isStageConfigLoading || isUserPositionLoading) {
    return <GlobalLoading />
  }

  if (!space) {
    return null
  }

  const isValidStage = stageConfig && userPosition

  const isConfiguring = isStageConfigurationOpen || !isValidStage

  return (
    <div className="flex h-screen flex-col">
      <Header onEditSpace={() => setIsStageConfigurationOpen(true)} />

      <main className="flex min-h-0 flex-1">
        <div className="relative flex-1 overflow-hidden bg-neutral-500 p-4">
          {isValidStage && (
            <Stage
              isConfiguring={isConfiguring}
              userPosition={userPosition}
              configItem={configItem}
              dimensions={{
                rows: stageConfig.rows,
                columns: stageConfig.columns,
              }}
              data={stageConfig}
            />
          )}
          <Meeting
            mediasoupClient={mediasoupClient}
            recorder={recorder}
            zones={stageConfig?.zones}
          />
          {isConfiguring && (
            <Configuration
              item={configItem}
              onItemClick={setConfigItem}
              onClose={() => setIsStageConfigurationOpen(false)}
            />
          )}
        </div>
        {sideWindow === 'chat' && (
          <ChatSideWindow onClose={() => setSideWindow(null)} />
        )}
        {sideWindow === 'participants' && (
          <ParticipantsSideWindow onClose={() => setSideWindow(null)} />
        )}
      </main>
      <div>
        <Footer
          isChatActive={sideWindow === 'chat'}
          isParticipantsActive={sideWindow === 'participants'}
          onChatClick={() =>
            setSideWindow((previousSetWindow) =>
              previousSetWindow === 'chat' ? null : 'chat'
            )
          }
          onParticipantsClick={() =>
            setSideWindow((previousSetWindow) =>
              previousSetWindow === 'participants' ? null : 'participants'
            )
          }
          mediasoupClient={mediasoupClient}
          recorder={recorder}
        />
      </div>
    </div>
  )
}

export default Space
