import useSWRSubscription, { SWRSubscriptionResponse } from 'swr/subscription'
import subscribeEmojiReaction from '@/db/subscribeEmojiReaction'
import { EmojiReaction } from '@/app/types'

const useEmojiReaction = (
  spaceId?: string
): SWRSubscriptionResponse<EmojiReaction> =>
  useSWRSubscription(
    spaceId ? ['emoji-reactions', spaceId] : null,
    subscribeEmojiReaction
  )

export default useEmojiReaction
