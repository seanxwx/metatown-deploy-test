import createSupabaseClient from '@/utils/createSupabaseClient'
import upsertZone from './upsertZone'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('upsertZone', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls the supabase upsert with data', async () => {
    const data = {
      id: 'ZONE_ID',
      spaceId: 'SPACE_ID',
      name: 'ZONE_NAME',
      type: 'MEETING',
      size: 10,
    } as const

    const zone = { id: 'ZONE_ID' }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: zone }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)
    await upsertZone(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('zones')

    expect(supabaseClient.from('zones').upsert).toHaveBeenCalledWith(
      {
        id: data.id,
        space_id: data.spaceId,
        name: data.name,
        type: data.type,
        size: data.size,
      },
      { onConflict: 'id' }
    )
  })

  test('returns upserted zone', async () => {
    const data = {
      id: 'ZONE_ID',
      spaceId: 'SPACE_ID',
      name: 'ZONE_NAME',
      type: 'MEETING',
      size: 10,
    } as const

    const zone = { id: 'ZONE_ID' }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: zone }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)
    const result = await upsertZone(data)

    expect(
      supabaseClient.from('zones').upsert({
        id: data.id,
        space_id: data.spaceId,
        name: data.name,
        type: data.type,
        size: data.size,
      }).select
    ).toHaveBeenCalledWith('id')

    expect(result).toEqual(zone)
  })
})
