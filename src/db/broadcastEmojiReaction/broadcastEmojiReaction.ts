import createSupabaseClient from '@/utils/createSupabaseClient'

export interface Emoji {
  unicode: string
  label: string
}

const broadcastEmojiReaction = async (
  channelId: string,
  payload: { emoji: Emoji; userId: string }
): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient
    .channel(`emoji-reactions:${channelId}`, {
      config: {
        broadcast: { self: true },
      },
    })
    .send({
      type: 'broadcast',
      event: 'emoji',
      payload: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    })
}

export default broadcastEmojiReaction
