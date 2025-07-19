import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ConfigPosition } from '@/app/types'
import useSpace from '@/hooks/useSpace'
import useStageConfig from '@/hooks/useStageConfig'
import createOptimisticDataCallback from './_utils/createOptimisticDataCallback'
import createStageConfigMutatorCallback from './_utils/createStageConfigMutatorCallback'

const useUpdateStageConfig = (
  stage: HTMLElement | undefined | null,
  {
    configPosition,
  }: {
    configPosition: ConfigPosition | null
  }
): void => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { mutate } = useStageConfig(space?.id)

  const [isMouseDown, setIsMouseDown] = useState(false)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent): void => {
      if (
        !(event.target instanceof HTMLElement) ||
        !stage?.contains(event.target)
      ) {
        return
      }

      setIsMouseDown(true)
    }

    const handleMouseUp = (): void => setIsMouseDown(false)

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return (): void => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [stage])

  useEffect(() => {
    if (!space || !configPosition || !isMouseDown) {
      return
    }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      space.id,
      configPosition
    )

    const optimisticDataCallback = createOptimisticDataCallback(configPosition)

    void mutate(stageConfigMutatorCallback, {
      optimisticData: optimisticDataCallback,
      revalidate: false,
      populateCache: false,
    })
  }, [isMouseDown, configPosition, space, mutate])
}

export default useUpdateStageConfig
