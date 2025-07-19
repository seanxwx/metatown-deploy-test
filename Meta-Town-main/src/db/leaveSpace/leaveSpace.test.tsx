import createSupabaseClient from '@/utils/createSupabaseClient'
import leaveSpace from './leaveSpace'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('leaveSpace', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls supabase to delete a space user relation', async () => {
    const data = {
      spaceId: 'SPACE_ID',
      userId: 'ID',
    }

    const superClient = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        match: vi.fn().mockReturnThis(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClientMock>
    createSupabaseClientMock.mockReturnValue(superClient)
    await leaveSpace(data)

    expect(superClient.from).toHaveBeenCalledWith('_users_joined_spaces')
    expect(superClient.from('_users_joined_spaces').delete).toHaveBeenCalled()
    expect(
      superClient.from('_users_joined_spaces').delete().match
    ).toHaveBeenCalledWith({
      A: data.spaceId,
      B: data.userId,
    })
  })
})
