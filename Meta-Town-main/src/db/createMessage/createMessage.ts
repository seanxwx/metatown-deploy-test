import { type JSONContent } from '@tiptap/react'
import createSupabaseClient from '@/utils/createSupabaseClient'

interface Data {
  senderId: string
  spaceId: string
  content: JSONContent
}

const createMessage = async (data: Data): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient.from('messages').insert({
    space_id: data.spaceId,
    sender_id: data.senderId,
    content: data.content,
  })
}

export default createMessage
