import { useEffect, useState } from 'react'
import {
  Block,
  CameraOffset,
  ConfigItem,
  ConfigPosition,
  Dimensions,
  Ground,
  Indexed,
  Position,
} from '@/app/types'
import isValidPosition from '../../_utils/isValidPosition'
import { TILE_SIZE } from '../../consts'
import isConfigurable from './_utils/isConfigurable'

const useConfigPosition = (
  canvas: HTMLCanvasElement | null,
  configItem: ConfigItem | null,
  dimensions: Dimensions,
  { cameraOffset, zoom }: { cameraOffset: CameraOffset; zoom: number },
  {
    blocks,
    entry,
    zones,
    grounds,
  }: {
    entry: Position
    blocks?: Block[] | null
    zones?: Indexed<Position>[] | null
    grounds?: Ground[] | null
  }
): ConfigPosition | null => {
  const [configPosition, setConfigPosition] = useState<ConfigPosition | null>(
    null
  )

  useEffect(() => {
    if (!configItem) {
      setConfigPosition(null)

      return
    }

    if (!canvas) {
      return
    }

    const handleMouseLeave = (): void => {
      setConfigPosition(null)
    }

    const handleMouseMove = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect()

      const canvasX = event.clientX - rect.left
      const canvasY = event.clientY - rect.top

      const cameraX = (canvasX - cameraOffset.left) / zoom
      const cameraY = (canvasY - cameraOffset.top) / zoom

      const x = Math.floor(cameraX / TILE_SIZE)
      const y = Math.floor(cameraY / TILE_SIZE)

      if (!isValidPosition(dimensions, { x, y })) {
        return
      }

      const nextConfigPosition: ConfigPosition | null = isConfigurable(
        configItem,
        { x, y },
        {
          blocks,
          entry,
          grounds,
          zones,
        }
      )
        ? { x, y, direction: 'N', ...configItem }
        : null

      setConfigPosition(nextConfigPosition)
    }

    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return (): void => {
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [
    canvas,
    configItem,
    dimensions,
    entry,
    blocks,
    zones,
    grounds,
    cameraOffset,
    zoom,
  ])

  return configPosition
}

export default useConfigPosition
