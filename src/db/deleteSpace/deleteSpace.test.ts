import createSupabaseClient from '@/utils/createSupabaseClient'
import deleteSpace from './deleteSpace'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('deleteSpace', () => {
  test('calls supabase to delete a space', async () => {
    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>
    createSupabaseClientMock.mockReturnValue(supabaseClient)
    const spaceId = 'SPACE_ID'
    await deleteSpace(spaceId)

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')
    expect(supabaseClient.from('spaces').delete).toHaveBeenCalled()
    expect(supabaseClient.from('spaces').delete().eq).toHaveBeenCalledWith(
      'id',
      spaceId
    )
  })
})
