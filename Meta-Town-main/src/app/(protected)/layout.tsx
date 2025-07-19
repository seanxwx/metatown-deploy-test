import { FC, ReactNode } from 'react'
import Guard from './_components/Guard'

interface Props {
  children: ReactNode
}

const ProtectedLayout: FC<Props> = ({ children }) => <Guard>{children}</Guard>

export default ProtectedLayout
