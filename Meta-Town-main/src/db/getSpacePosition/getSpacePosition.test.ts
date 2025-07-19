import createSupabaseClient from '@/utils/createSupabaseClient'
import getSpacePosition from './getSpacePosition'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getSpacePosition', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns space position', async () => {
    const spaceId = 'SPACE_ID'
    const userId = 'USER_ID'

    const data = {
      id: 'USER_POSITION_ID',
      user_id: 'USER_ID1',
      space_id: spaceId,
      x: 10,
      y: 20,
      direction: 'N',
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          match: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spacePosition = await getSpacePosition([
      'user-positions',
      userId,
      spaceId,
    ])

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_positions')

    expect(
      supabaseClient.from('user_space_positions').select
    ).toHaveBeenCalledWith(
      `
        id,
        space_id,
        user_id,
        x,
        y,
        direction
      `
    )

    expect(
      supabaseClient.from('user_space_positions').select().match
    ).toHaveBeenCalledWith({
      space_id: spaceId,
      user_id: userId,
    })

    expect(
      supabaseClient.from('user_space_positions').select().match({
        space_id: spaceId,
        user_id: userId,
      }).single
    ).toHaveBeenCalled()

    expect(spacePosition).toEqual({
      id: data.id,
      userId: data.user_id,
      spaceId: data.space_id,
      x: data.x,
      y: data.y,
      direction: data.direction,
    })
  })

  test('returns null if no space position found', async () => {
    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          match: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({ data: null }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spacePosition = await getSpacePosition([
      'user-positions',
      'USER_ID',
      'SPACE_ID',
    ])

    expect(spacePosition).toBeNull()
  })
})
