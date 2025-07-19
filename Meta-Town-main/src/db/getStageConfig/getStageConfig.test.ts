import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getStageConfig, { OverrideConfig } from './getStageConfig'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getStageConfig', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns stage configs', async () => {
    const spaceId = 'SPACE_ID'

    const data = {
      id: 'STAGE_CONFIGS_ID',
      rows: 10,
      columns: 10,
      blocks: [
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
      ],
      entry: { x: 1, y: 1 },
      zones: [
        {
          id: 'ZONE_1',
          x: 5,
          y: 5,
          direction: 'N',
          createdAt: '2023-10-01T00:00:00Z',
        },
        { id: 'ZONE_2', x: 6, y: 6, direction: 'N' },
      ],
      grounds: [{ x: 2, y: 2 }],
    }

    const supabaseClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      overrideTypes: vi.fn().mockReturnValue({
        data,
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const stageConfig = await getStageConfig(['stage-config', spaceId])

    expect(supabaseClient.from).toHaveBeenCalledWith('stage_configs')
    expect(supabaseClient.from('stage_configs').select).toHaveBeenCalledWith(
      `
      id, 
      rows, 
      columns, 
      blocks,
      entry,
      zones,
      grounds
    `
    )

    expect(
      supabaseClient.from('stage_configs').select(`
      id, 
      rows, 
      columns, 
      blocks,
      entry,
      zones,
      grounds
    `).eq
    ).toHaveBeenCalledWith('space_id', spaceId)

    expect(
      supabaseClient
        .from('stage_configs')
        .select(
          `
      id, 
      rows, 
      columns, 
      blocks,
      entry,
      zones,
      grounds
    `
        )
        .eq('space_id', spaceId).single
    ).toHaveBeenCalled()

    expect(
      supabaseClient
        .from('stage_configs')
        .select(
          `
      id, 
      rows, 
      columns, 
      blocks,
      entry,
      zones,
      grounds
    `
        )
        .eq('space_id', spaceId)
        .single().overrideTypes
    ).toHaveBeenCalled()

    type StageConfig = {
      id: string
      rows: number
      columns: number
    } & OverrideConfig

    expectTypeOf(stageConfig).toEqualTypeOf<StageConfig | null>()

    expect(stageConfig).toEqual(camelcaseKeys(data))
  })

  test('returns null when space configs not found', async () => {
    const supabaseClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      overrideTypes: vi.fn().mockReturnValue({
        data: undefined,
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const stageConfig = await getStageConfig([
      'stage-config',
      'INVALID_SPACE_ID',
    ])

    expect(stageConfig).toBeNull()
  })
})
