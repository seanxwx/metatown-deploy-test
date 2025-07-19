import { RealtimeChannel } from '@supabase/supabase-js'
import createSyncHandler from './createSyncHandler'

describe('createSyncHandler', () => {
  test('returns a function that updates the next state with channel presences', () => {
    const next = vi.fn()

    const users = ['USER_ID_1', 'USER_ID_2']

    const presenceState = {
      PRESENCE_1: [
        {
          userId: users[0],
        },
      ],
      PRESENCE_2: [
        {
          userId: users[1],
        },
      ],
    }

    const channel = {
      presenceState: vi.fn().mockReturnValue(presenceState),
    }

    const handleSync = createSyncHandler(
      { next },
      channel as unknown as RealtimeChannel
    )

    handleSync()

    expect(next).toHaveBeenCalledWith(null, users)
  })
})
