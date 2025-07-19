import { useParams } from 'next/navigation'
import { FC } from 'react'
import { ConfigItem } from '@/app/types'
import Button from '@/components/Button'
import GroundFloor from '@/components/GroundFloor'
import IconButton from '@/components/IconButton'
import useDrag from '@/hooks/useDrag'
import useSpace from '@/hooks/useSpace'
import useStageConfig from '@/hooks/useStageConfig'
import ConfigDimensionsForm from './_components/ConfigDimensionsForm'
import DirectionalAsset from './_components/DirectionalAsset'
import MeetingZone from './_components/MeetingZone'

interface Props {
  item?: ConfigItem | null
  onItemClick: (item: ConfigItem | null) => void
  onClose: () => void
}

const Configuration: FC<Props> = ({ item = null, onItemClick, onClose }) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: stageConfig, isValidating } = useStageConfig(space?.id)

  const {
    handleRef: dragHandleRef,
    targetRef: dragTargetRef,
    style,
  } = useDrag()

  return (
    <div
      className="absolute left-24 top-48 w-[550px] rounded-md bg-white shadow-lg"
      role="dialog"
      aria-label="Configuration"
      ref={dragTargetRef}
      style={style}
    >
      <div
        className="flex cursor-grab items-center justify-between p-4"
        ref={dragHandleRef}
      >
        <div>Config Space</div>
        {stageConfig && (
          <IconButton
            icon="x"
            label="Close"
            variant="naked"
            size="small"
            onClick={() => {
              onItemClick(null)
              onClose()
            }}
          />
        )}
      </div>
      <div className="space-y-2 bg-gray-100 px-4 py-4">
        {!stageConfig && (
          <div className="text-sm text-neutral-500">
            Set the size of you space, You can change this later!
          </div>
        )}
        <ConfigDimensionsForm />
      </div>
      {stageConfig && (
        <div className="mt-10 space-y-8 p-4">
          <MeetingZone
            selectedId={item?.type === 'zone' ? item.id : undefined}
            onSelect={(id) => onItemClick({ type: 'zone', id })}
          />
          <DirectionalAsset
            title="Walls"
            name="wall"
            onClick={(direction) =>
              onItemClick({ type: 'blocks', element: 'wall', direction })
            }
            isActive={(direction) =>
              item?.type === 'blocks' && item.direction === direction
            }
          />
          <DirectionalAsset
            title="Chairs"
            name="chair"
            onClick={(direction) =>
              onItemClick({ type: 'grounds', direction, texture: 'chair' })
            }
            isActive={(direction) =>
              item?.type === 'grounds' &&
              item.texture === 'chair' &&
              item.direction === direction
            }
          />
          <div className="space-y-2">
            <p>Grounds</p>
            <div className="space-x-4">
              {(['wood', 'grass'] as const).map((texture) => (
                <Button
                  onClick={() => onItemClick({ type: 'grounds', texture })}
                  size="large"
                  variant={
                    item && item.type === 'grounds' && item.texture === texture
                      ? 'success'
                      : 'secondary'
                  }
                  key={texture}
                >
                  <GroundFloor texture={texture} />
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="space-x-4">
              <IconButton
                disabled={isValidating}
                onClick={() => onItemClick({ type: 'entry' })}
                icon="door-open"
                label="Entry"
                variant={item?.type === 'entry' ? 'success' : 'secondary'}
              />
            </div>

            <IconButton
              disabled={isValidating}
              onClick={() => onItemClick({ type: 'delete' })}
              icon="trash-2"
              label="Delete"
              variant={item?.type === 'delete' ? 'danger' : 'secondary'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Configuration
