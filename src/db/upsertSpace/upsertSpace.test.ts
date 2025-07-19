import createSupabaseClient from '@/utils/createSupabaseClient'
import upsertSpace from './upsertSpace'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('upsertSpace', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls the supabase upsert with data', async () => {
    const data = { id: 'SPACE_ID', name: 'SPACE_NAME', ownerId: 'OWNER_ID' }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 'SPACE_ID' } }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)
    await upsertSpace(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').upsert).toHaveBeenCalledWith(
      {
        id: data.id,
        name: data.name,
        owner_id: data.ownerId,
      },
      { onConflict: 'id' }
    )
  })

  test('returns upserted space', async () => {
    const data = { name: 'SPACE_NAME', ownerId: 'OWNER_ID' }
    const space = { id: 'UPSERT_SPACE_ID' }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: space }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)
    const result = await upsertSpace(data)

    expect(
      supabaseClient.from('spaces').upsert({
        name: data.name,
        owner_id: data.ownerId,
      }).select
    ).toHaveBeenCalledWith('id')

    expect(result).toEqual(space)
  })
})
