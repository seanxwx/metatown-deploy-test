import createSupabaseClient from '@/utils/createSupabaseClient'
import upsertStageConfig from './upsertStageConfig'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('upsertStageConfig', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls supabase upsert with data', async () => {
    const data = {
      spaceId: 'SPACE_ID',
      rows: 10,
      columns: 10,
      blocks: [],
      entry: { x: 1, y: 1, direction: 'N' } as const,
      grounds: [],
      zones: [],
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnValue(undefined),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await upsertStageConfig(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('stage_configs')
    expect(supabaseClient.from('stage_configs').upsert).toHaveBeenCalledWith(
      {
        space_id: data.spaceId,
        rows: data.rows,
        columns: data.columns,
        blocks: data.blocks,
        entry: data.entry,
        grounds: data.grounds,
        zones: data.zones,
      },
      {
        onConflict: 'space_id',
      }
    )
  })

  test.each(['blocks', 'grounds', 'zones'] as const)(
    'sets %s to null in upsert when it is undefined',
    async (type) => {
      const data = {
        spaceId: 'SPACE_ID',
        rows: 10,
        columns: 10,
        blocks: [],
        entry: { x: 1, y: 1, direction: 'N' } as const,
        grounds: [],
        zones: [],
      }

      delete data[type]

      const supabaseClient = {
        from: vi.fn().mockReturnValue({
          upsert: vi.fn().mockReturnValue(undefined),
        }),
      } as unknown as ReturnType<typeof createSupabaseClient>

      createSupabaseClientMock.mockReturnValue(supabaseClient)

      await upsertStageConfig(data)

      expect(supabaseClient.from).toHaveBeenCalledWith('stage_configs')
      expect(supabaseClient.from('stage_configs').upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          [type]: null,
        }),
        {
          onConflict: 'space_id',
        }
      )
    }
  )
})
