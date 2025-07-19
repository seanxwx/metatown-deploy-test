import { FC } from 'react'
import SideWindow from '../SideWindow'
import Messages from './_components/Messages'
import Form from './_components/Form'

interface Props {
  onClose: () => void
}

const ChatSideWindow: FC<Props> = ({ onClose }) => (
  <SideWindow label="Chat Side Window" header="Chat" onClose={onClose}>
    <div className="flex h-full flex-col justify-between gap-6">
      <Messages />
      <Form />
    </div>
  </SideWindow>
)

export default ChatSideWindow
