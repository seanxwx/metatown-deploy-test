import { mutate } from 'swr'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'
import createSubscriptionMutatorCallback from '@/utils/createSubscriptionMutatorCallback'
import subscribeMessages, { transformSpaceMessages } from './subscribeMessages'

vi.mock('swr')

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

vi.mock('@/utils/createSubscriptionMutatorCallback')

const createSubscriptionMutatorCallbackMock = vi.mocked(
  createSubscriptionMutatorCallback
)

describe('subscribeMessages', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('subscribes to space-messages:SPACE_ID channel', () => {
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

    const unsubscribe = subscribeMessages(['space-messages', SPACE_ID])

    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `space-messages:${SPACE_ID}`
    )

    expect(
      supabaseClient.channel(`space-messages:${SPACE_ID}`).on
    ).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `space_id=eq.${SPACE_ID}`,
      },
      expect.any(Function)
    )

    expect(
      supabaseClient.channel(`space-messages:${SPACE_ID}`).on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
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

    const key: [string, string] = ['space-messages', SPACE_ID]

    subscribeMessages(key)

    expect(createSubscriptionMutatorCallbackMock).toHaveBeenCalledWith(
      data,
      transformSpaceMessages
    )

    expect(mutate).toHaveBeenCalledWith(key, subscriptionMutatorCallback, {
      revalidate: false,
    })
  })

  test('updates data by the callback `transformSpaceMessages`', () => {
    const row = {
      content: 'Hello World',
      created_at: '2021-01-01T00:00:00.000Z',
      id: 'ID',
      sender_id: 'SENDER_ID',
    } as unknown as Tables<'messages'>

    const result = transformSpaceMessages(row)

    expect(result).toEqual({
      content: 'Hello World',
      createdAt: '2021-01-01T00:00:00.000Z',
      id: 'ID',
      senderId: 'SENDER_ID',
    })
  })
})
