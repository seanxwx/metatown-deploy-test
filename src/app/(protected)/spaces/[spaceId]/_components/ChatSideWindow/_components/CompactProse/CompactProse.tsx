import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const CompactProse: FC<Props> = ({ children }) => (
  <div className="prose prose-p:m-0 prose-code:bg-gray-800 prose-code:px-[2px] prose-code:py-[2px] prose-code:text-gray-200 prose-code:before:content-none prose-code:after:content-none prose-pre:m-0 prose-ol:m-0 prose-ul:m-0 prose-li:m-0">
    {children}
  </div>
)

export default CompactProse
