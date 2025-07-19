import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getZones, { Data } from './getZones'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getZones', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns zones of a space', async () => {
    const spaceId = 'SPACE_ID'

    const data: Data[] = [
      {
        id: 'ID_A',
        name: 'ZONE_A',
        size: null,
      },
      {
        id: 'ID_B',
        name: 'ZONE_B',
        size: 10,
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data,
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const zones = await getZones(['zones', spaceId])

    expect(supabaseClient.from).toHaveBeenCalledWith('zones')

    expect(supabaseClient.from('zones').select).toHaveBeenCalledWith(
      'id, name, size'
    )

    expect(
      supabaseClient.from('zones').select('id, name, size').eq
    ).toHaveBeenCalledWith('space_id', spaceId)

    expect(zones).toEqual(camelcaseKeys(data))
  })

  test('returns null if zones not found', async () => {
    const spaceId = 'SPACE_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data: null,
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const zones = await getZones(['zones', spaceId])

    expect(zones).toBeNull()
  })
})
