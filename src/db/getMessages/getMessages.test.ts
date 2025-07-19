import createSupabaseClient from '@/utils/createSupabaseClient'
import getMessages from './getMessages'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getMessages', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('return messages', async () => {
    const spaceId = 'SPACE_ID'

    const data = [
      {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello World!',
                },
              ],
            },
          ],
        },
        created_at: '2021-01-01T00:00:00.000Z',
        id: 'ID',
        sender_id: 'SENDER_ID',
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              overrideTypes: vi.fn().mockReturnValue({ data }),
            }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const messages = await getMessages(['messages', spaceId])

    expect(supabaseClient.from).toHaveBeenCalledWith('messages')

    expect(supabaseClient.from('messages').select).toHaveBeenCalledWith(
      'content,created_at,id,sender_id'
    )

    expect(
      supabaseClient.from('messages').select('content,created_at,id,sender_id')
        .eq
    ).toHaveBeenCalledWith('space_id', spaceId)

    expect(
      supabaseClient
        .from('messages')
        .select('content,created_at,id,sender_id')
        .eq('space_id', spaceId).order
    ).toHaveBeenCalledWith('created_at')

    expect(
      supabaseClient
        .from('messages')
        .select('content,created_at,id,sender_id')
        .eq('space_id', spaceId)
        .order('created_at').overrideTypes
    ).toHaveBeenCalled()

    expect(messages).toEqual([
      {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello World!',
                },
              ],
            },
          ],
        },
        createdAt: '2021-01-01T00:00:00.000Z',
        id: 'ID',
        senderId: 'SENDER_ID',
      },
    ])
  })

  test('return empty array if no message found', async () => {
    const spaceId = 'SPACE_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              overrideTypes: vi.fn().mockReturnValue({ data: null }),
            }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const messages = await getMessages(['messages', spaceId])

    expect(supabaseClient.from).toHaveBeenCalledWith('messages')

    expect(supabaseClient.from('messages').select).toHaveBeenCalledWith(
      'content,created_at,id,sender_id'
    )

    expect(
      supabaseClient.from('messages').select('content,created_at,id,sender_id')
        .eq
    ).toHaveBeenCalledWith('space_id', spaceId)

    expect(
      supabaseClient
        .from('messages')
        .select('content,created_at,id,sender_id')
        .eq('space_id', spaceId).order
    ).toHaveBeenCalledWith('created_at')

    expect(
      supabaseClient
        .from('messages')
        .select('content,created_at,id,sender_id')
        .eq('space_id', spaceId)
        .order('created_at').overrideTypes
    ).toHaveBeenCalled()

    expect(messages).toEqual([])
  })
})
