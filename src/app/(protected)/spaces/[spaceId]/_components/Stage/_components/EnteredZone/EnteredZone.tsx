import { FC, useRef } from 'react'
import {
  CameraOffset,
  Dimensions,
  Indexed,
  Movement,
  Position,
} from '@/app/types'
import useDrawCanvas from '../../_hooks/useDrawCanvas'
import Canvas from '../Canvas'
import drawEnteredZone from './_utils/drawEnteredZone'

interface Props {
  zones: Indexed<Position>[] | null
  movement?: Movement
  dimensions: Dimensions
  canvasConfig: {
    zoom: number
    cameraOffset: CameraOffset
  }
}

const EnteredZone: FC<Props> = ({
  zones,
  movement = undefined,
  dimensions,
  canvasConfig,
}) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useDrawCanvas(ref.current, canvasConfig, (context) => {
    if (!zones || !movement) {
      return
    }

    const enteredZone = zones.find(
      (zone) => zone.x === movement.x && zone.y === movement.y
    )

    if (!enteredZone) {
      return
    }

    drawEnteredZone(context, enteredZone, dimensions, zones)
  })

  return <Canvas ref={ref} aria-label="Entered Zone Canvas" />
}

export default EnteredZone
