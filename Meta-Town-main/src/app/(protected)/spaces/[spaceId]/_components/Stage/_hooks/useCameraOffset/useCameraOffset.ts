import { RefObject, useEffect, useState } from 'react'
import { Dimensions, Position } from '@/app/types'
import getCameraOffset from './_utils/getCameraOffset'

const useCameraOffset = (
  ref: RefObject<HTMLCanvasElement | null>,
  {
    zoom,
    dimensions,
    userPosition,
  }: {
    zoom: number
    dimensions: Dimensions
    userPosition: Position
  }
): {
  top: number
  left: number
} => {
  const [cameraOffset, setCameraOffset] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })

  useEffect(() => {
    const target = ref.current

    const handleResize = (): void => {
      const offset = getCameraOffset(target, {
        zoom,
        dimensions,
        userPosition,
      })

      setCameraOffset(offset)
    }

    handleResize()

    if (!target) {
      return
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(target)

    return (): void => {
      observer.disconnect()
    }
  }, [dimensions, ref, userPosition, zoom])

  return cameraOffset
}

export default useCameraOffset
