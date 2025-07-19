import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import { type JSONContent } from '@tiptap/core'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type Message = CamelCaseKeys<
  Pick<Tables<'messages'>, 'created_at' | 'id' | 'sender_id'> & {
    content: JSONContent
  }
>

const getMessages = async ([, spaceId]: [string, string]): Promise<
  Message[]
> => {
  const supabaseClient = createSupabaseClient()

  const { data: messages } = await supabaseClient
    .from('messages')
    .select('content,created_at,id,sender_id')
    .eq('space_id', spaceId)
    .order('created_at')
    .overrideTypes<{ content: JSONContent }[]>()

  if (!messages) {
    return []
  }

  return camelcaseKeys(messages)
}

export default getMessages
