import createSupabaseClient from '@/utils/createSupabaseClient'
import joinSpace from './joinSpace'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('joinSpace', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('add user to space and assign a space user position', async () => {
    const data = {
      spaceId: 'SPACE_ID',
      userId: 'ID',
    }

    const entry = {
      x: 0,
      y: 0,
      direction: 'N',
    }

    const fromStageConfigs = {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            overrideTypes: vi.fn().mockResolvedValue({
              data: { entry },
            }),
          }),
        }),
      }),
    }

    const fromUsersJoinedSpaces = {
      insert: vi.fn(),
    }

    const fromUserSpacePositions = {
      insert: vi.fn(),
    }

    const supabaseClient = {
      from: vi.fn().mockImplementation(
        (tableName: string) =>
          ({
            stage_configs: fromStageConfigs,
            _users_joined_spaces: fromUsersJoinedSpaces,
            user_space_positions: fromUserSpacePositions,
          })[tableName]
      ),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await joinSpace(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('stage_configs')

    expect(supabaseClient.from('stage_configs').select).toHaveBeenCalledWith(
      'entry'
    )

    expect(
      supabaseClient.from('stage_configs').select('entry').eq
    ).toHaveBeenCalledWith('space_id', data.spaceId)

    expect(
      supabaseClient
        .from('stage_configs')
        .select('entry')
        .eq('space_id', data.spaceId).single
    ).toHaveBeenCalled()

    expect(
      supabaseClient
        .from('stage_configs')
        .select('entry')
        .eq('space_id', data.spaceId)
        .single().overrideTypes
    ).toHaveBeenCalled()

    expect(supabaseClient.from).toHaveBeenCalledWith('_users_joined_spaces')
    expect(
      supabaseClient.from('_users_joined_spaces').insert
    ).toHaveBeenCalledWith({
      A: data.spaceId,
      B: data.userId,
    })

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_positions')
    expect(
      supabaseClient.from('user_space_positions').insert
    ).toHaveBeenCalledWith({
      space_id: data.spaceId,
      user_id: data.userId,
      x: entry.x,
      y: entry.y,
      direction: entry.direction,
    })
  })

  test('does not insert user position to space if entry is not found', async () => {
    const data = {
      spaceId: 'SPACE_ID',
      userId: 'ID',
    }

    const fromStageConfigs = {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            overrideTypes: vi.fn().mockResolvedValue({
              data: null,
            }),
          }),
        }),
      }),
    }

    const fromUsersJoinedSpaces = {
      insert: vi.fn(),
    }

    const fromUserSpacePositions = {
      insert: vi.fn(),
    }

    const supabaseClient = {
      from: vi.fn().mockImplementation(
        (tableName: string) =>
          ({
            stage_configs: fromStageConfigs,
            _users_joined_spaces: fromUsersJoinedSpaces,
            user_space_positions: fromUserSpacePositions,
          })[tableName]
      ),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await expect(joinSpace(data)).rejects.toThrow('SPACE_STAGE_ENTRY_NOT_FOUND')

    expect(supabaseClient.from).toHaveBeenCalledWith('stage_configs')

    expect(supabaseClient.from('stage_configs').select).toHaveBeenCalledWith(
      'entry'
    )

    expect(
      supabaseClient.from('stage_configs').select('entry').eq
    ).toHaveBeenCalledWith('space_id', data.spaceId)

    expect(
      supabaseClient
        .from('stage_configs')
        .select('entry')
        .eq('space_id', data.spaceId).single
    ).toHaveBeenCalled()

    expect(
      supabaseClient
        .from('stage_configs')
        .select('entry')
        .eq('space_id', data.spaceId)
        .single().overrideTypes
    ).toHaveBeenCalled()

    expect(supabaseClient.from).toHaveBeenCalledWith('_users_joined_spaces')
    expect(
      supabaseClient.from('_users_joined_spaces').insert
    ).toHaveBeenCalledWith({
      A: data.spaceId,
      B: data.userId,
    })

    expect(supabaseClient.from).not.toHaveBeenCalledWith('user_space_positions')
  })
})
