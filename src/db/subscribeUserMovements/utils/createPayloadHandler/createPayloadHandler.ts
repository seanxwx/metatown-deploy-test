import { SWRSubscriptionOptions } from 'swr/subscription'
import { Indexed } from '@/app/types'

const createPayloadHandler =
  <T extends Indexed<unknown>>({ next }: SWRSubscriptionOptions<T[]>) =>
  ({ payload }: { payload: T }): void =>
    next(null, (previousData) => {
      if (!previousData) {
        return [payload]
      }

      return previousData
        .filter((item) => item.id !== payload.id)
        .concat(payload)
    })

export default createPayloadHandler
