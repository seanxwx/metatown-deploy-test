import { FC } from 'react'
import clsx from 'clsx'

interface Props {
  name: string
  time: string
  isSender?: boolean
}

const Meta: FC<Props> = ({ name, time, isSender = false }) => (
  <div
    role="contentinfo"
    aria-label="meta"
    className={clsx({ 'text-right': isSender })}
  >
    {!isSender && <span className="mr-2 font-medium">{name}</span>}
    <span className="text-sm text-neutral-500">{time}</span>
  </div>
)

export default Meta
