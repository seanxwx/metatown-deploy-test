import createSupabaseClient from '@/utils/createSupabaseClient'
import createMessage from './createMessage'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('createMessage', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('send a message', async () => {
    const data = {
      senderId: 'SENDER_ID',
      spaceId: 'SPACE_ID',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello World' }],
          },
        ],
      },
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>
    createSupabaseClientMock.mockReturnValue(supabaseClient)
    await createMessage(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('messages')
    expect(supabaseClient.from('messages').insert).toHaveBeenCalledWith({
      space_id: data.spaceId,
      sender_id: data.senderId,
      content: data.content,
    })
  })
})
