import React, { ReactNode, FC } from 'react'
import IconButton from '@/components/IconButton'

interface Props {
  label: string
  children: ReactNode
  header: ReactNode
  onClose: () => void
}

const SideWindow: FC<Props> = ({ label, children, header, onClose }) => (
  <div
    role="region"
    aria-label={label}
    className="flex w-[450px] flex-col bg-gray-100"
  >
    <div className="flex items-center justify-between bg-neutral-300 px-6 py-4">
      {header}

      <IconButton
        variant="secondary"
        size="small"
        icon="x"
        label="Close"
        onClick={onClose}
      />
    </div>

    <div className="flex-1 overflow-auto p-6">{children}</div>
  </div>
)

export default SideWindow
