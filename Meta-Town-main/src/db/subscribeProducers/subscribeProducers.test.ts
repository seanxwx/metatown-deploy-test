import { mutate } from 'swr'
import createSubscriptionMutatorCallback from '@/utils/createSubscriptionMutatorCallback'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'
import subscribeProducers, {
  transformSpaceProducers,
} from './subscribeProducers'

vi.mock('swr')

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

vi.mock('@/utils/createSubscriptionMutatorCallback')

const createSubscriptionMutatorCallbackMock = vi.mocked(
  createSubscriptionMutatorCallback
)

describe('subscribeProducers', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('subscribes to space-producers:SPACE_ID channel', () => {
    const SPACE_ID = 'SPACE_ID'

    const supabaseClient = {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnValue({
          subscribe: vi.fn(),
        }),
      }),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const unsubscribe = subscribeProducers(['space-producers', SPACE_ID])

    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `space-producers:${SPACE_ID}`
    )

    expect(
      supabaseClient.channel(`space-producers:${SPACE_ID}`).on
    ).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_space_mediasoup',
        filter: `space_id=eq.${SPACE_ID}`,
      },
      expect.any(Function)
    )

    expect(
      supabaseClient.channel(`space-producers:${SPACE_ID}`).on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_space_mediasoup',
          filter: `space_id=eq.${SPACE_ID}`,
        },
        vi.fn()
      ).subscribe
    ).toBeCalled()

    unsubscribe()

    expect(supabaseClient.removeChannel).toBeCalled()
  })

  test('calls subscriptionMutatorCallback with payload on message subscribed', () => {
    const SPACE_ID = 'SPACE_ID'

    const data = {
      commit_timestamp: 'COMMIT_TIMESTAMP',
      record: {} as const,
    }

    const subscriptionMutatorCallback = vi.fn()
    createSubscriptionMutatorCallbackMock.mockReturnValue(
      subscriptionMutatorCallback
    )

    const supabaseClient = {
      channel: vi.fn().mockReturnValue({
        on: vi
          .fn()
          .mockImplementation(
            (event, options, onMessage: (payload: unknown) => void) => {
              onMessage(data)

              return {
                subscribe: vi.fn(),
              }
            }
          ),
      }),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const key: [string, string] = ['space-producers', SPACE_ID]

    subscribeProducers(key)

    expect(createSubscriptionMutatorCallbackMock).toHaveBeenCalledWith(
      data,
      transformSpaceProducers
    )

    expect(mutate).toHaveBeenCalledWith(key, subscriptionMutatorCallback, {
      revalidate: false,
    })
  })

  test('updates data by the callback `transformSpaceProducers`', () => {
    const row: Tables<'user_space_mediasoup'> = {
      id: 'ID',
      created_at: 'CREATED_AT',
      updated_at: 'UPDATED_AT',
      space_id: 'SPACE_ID',
      user_id: 'USER_ID',
      producer_id: 'PRODUCER_ID',
      state: 'ACTIVE',
      kind: 'video',
    }

    const result = transformSpaceProducers(row)

    expect(result).toEqual({
      id: 'ID',
      userId: 'USER_ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
      kind: 'video',
    })
  })
})
