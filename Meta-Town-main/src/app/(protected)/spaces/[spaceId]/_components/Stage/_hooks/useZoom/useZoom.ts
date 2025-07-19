import { useState } from 'react'
import clamp from '@/utils/clamp'

export const BASE_ZOOM = 1

export const ZOOM_STEP = 0.25

export const ZOOM_CLAMP = 5

const clampZoom = (zoom: number): number =>
  clamp(
    zoom,
    BASE_ZOOM - ZOOM_CLAMP * ZOOM_STEP,
    BASE_ZOOM + ZOOM_CLAMP * ZOOM_STEP
  )

const useZoom = (): {
  zoom: number
  zoomIn: () => void
  zoomOut: () => void
} => {
  const [zoom, setZoom] = useState(BASE_ZOOM)

  return {
    zoom,
    zoomIn: (): void =>
      setZoom((previousZoom) => clampZoom(previousZoom + ZOOM_STEP)),
    zoomOut: (): void =>
      setZoom((previousZoom) => clampZoom(previousZoom - ZOOM_STEP)),
  }
}

export default useZoom
