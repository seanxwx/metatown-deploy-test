import clsx from 'clsx'
import { CanvasHTMLAttributes, FC, RefAttributes } from 'react'

const Canvas: FC<
  CanvasHTMLAttributes<HTMLCanvasElement> & RefAttributes<HTMLCanvasElement>
> = ({ className = '', ...props }) => (
  <canvas
    {...props}
    className={clsx(
      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform',
      className
    )}
  />
)

export default Canvas
