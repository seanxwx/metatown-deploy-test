import createSupabaseClient from '@/utils/createSupabaseClient'
import getUserPositions from './getUserPositions'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getUserPositions', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns users positions', async () => {
    const SPACE_ID = 'SPACE_ID'

    const data = [
      {
        id: '1',
        user_id: 'USER_ID1',
        space_id: SPACE_ID,
        x: 10,
        y: 20,
        direction: 'N',
      },
      {
        id: '2',
        user_id: 'USER_ID2',
        space_id: SPACE_ID,
        x: 15,
        y: 25,
        direction: 'S',
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ data }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const userPositions = await getUserPositions(['user-positions', SPACE_ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_positions')

    expect(
      supabaseClient.from('user_space_positions').select
    ).toHaveBeenCalledWith(
      `
        id,
        user_id,
        space_id,
        x,
        y,
        direction
      `
    )

    expect(
      supabaseClient.from('user_space_positions').select().eq
    ).toHaveBeenCalledWith('space_id', SPACE_ID)

    expect(userPositions).toEqual([
      {
        id: data[0].id,
        userId: data[0].user_id,
        spaceId: data[0].space_id,
        x: data[0].x,
        y: data[0].y,
        direction: data[0].direction,
      },
      {
        id: data[1].id,
        userId: data[1].user_id,
        spaceId: data[1].space_id,
        x: data[1].x,
        y: data[1].y,
        direction: data[1].direction,
      },
    ])
  })

  test('returns null if no user positions found', async () => {
    const SPACE_ID = 'SPACE_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ data: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const userPositions = await getUserPositions(['user-positions', SPACE_ID])

    expect(userPositions).toBeNull()
  })
})
