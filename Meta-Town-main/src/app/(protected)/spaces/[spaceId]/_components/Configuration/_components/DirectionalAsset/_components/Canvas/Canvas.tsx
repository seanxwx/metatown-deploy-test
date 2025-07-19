import { FC, useEffect, useRef } from 'react'
import { Direction } from '@/app/types'
import draw from './_utils/draw'

interface Props {
  name: 'wall' | 'chair'
  direction: Direction
}

const Canvas: FC<Props> = ({ name, direction }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current

    void draw(canvas, name, direction)
  }, [direction, name])

  return (
    <canvas ref={ref} role="img" aria-label={`Asset: ${name} - ${direction}`} />
  )
}

export default Canvas
