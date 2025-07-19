import clsx from 'clsx'
import { FC, RefCallback, useState } from 'react'
import IconButton from '@/components/IconButton'

interface Props {
  id: string
  ref: RefCallback<HTMLDivElement>
  isFocused?: boolean
  onFocus: () => void
}

export const MAXIMIZED = clsx('absolute inset-0')

export const NORMAL = clsx('relative rounded-2xl')

const Placeholder: FC<Props> = ({ id, ref, isFocused = false, onFocus }) => {
  const [isMaximized, setIsMaximized] = useState(false)

  return (
    <div
      data-id={id}
      ref={ref}
      role="presentation"
      aria-label={id}
      className={clsx(
        'group/placeholder isolate flex size-full items-center justify-center overflow-hidden bg-gray-200',
        isMaximized ? MAXIMIZED : NORMAL
      )}
    >
      {isFocused && (
        <div className="absolute right-2 top-2 hidden group-hover/placeholder:block">
          <IconButton
            label={isMaximized ? 'Focus' : 'Maximize'}
            icon={isMaximized ? 'focus' : 'fullscreen'}
            tooltip={{ position: 'left' }}
            variant="secondary"
            size="small"
            onClick={() =>
              setIsMaximized((previousIsMaximized) => !previousIsMaximized)
            }
          />
        </div>
      )}
      <div className="absolute bottom-2 right-2 hidden group-hover/placeholder:block">
        <IconButton
          icon={isFocused ? 'minimize' : 'focus'}
          label={isFocused ? 'Minimize' : 'Focus'}
          tooltip={{ position: 'left' }}
          size="small"
          variant="secondary"
          onClick={onFocus}
        />
      </div>
    </div>
  )
}

export default Placeholder
