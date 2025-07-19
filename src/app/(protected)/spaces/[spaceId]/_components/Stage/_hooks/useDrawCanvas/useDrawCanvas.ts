import { useEffect, useRef } from 'react'
import { CameraOffset } from '@/app/types'
import align from './_utils/align'

const useDrawCanvas = (
  canvas: HTMLCanvasElement | null,
  config: {
    zoom: number
    cameraOffset: CameraOffset
  },
  onDraw: (context: CanvasRenderingContext2D) => void
): void => {
  const configRef = useRef(config)

  useEffect(() => {
    configRef.current = config
  }, [config])

  const onDrawRef = useRef(onDraw)
  useEffect(() => {
    onDrawRef.current = onDraw
  }, [onDraw])

  useEffect(() => {
    let frame: number

    const draw = (): void => {
      if (!canvas?.parentElement) {
        return
      }

      canvas.width = align(canvas.parentElement.clientWidth)
      canvas.height = align(canvas.parentElement.clientHeight)

      const context = canvas.getContext('2d')

      if (!context) {
        return
      }

      const { zoom, cameraOffset } = configRef.current

      context.clearRect(0, 0, canvas.width, canvas.height)

      context.setTransform(
        zoom,
        0,
        0,
        zoom,
        cameraOffset.left,
        cameraOffset.top
      )

      onDrawRef.current(context)

      frame = window.requestAnimationFrame(draw)
    }

    draw()

    return (): void => {
      window.cancelAnimationFrame(frame)
    }
  }, [canvas])
}

export default useDrawCanvas
