import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getLastVisitedSpaces from './getLastVisitedSpaces'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getLastVisitedSpaces', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns joined spaces', async () => {
    vi.useFakeTimers()

    const data = [
      {
        id: 'Space_ID',
        name: 'Space Name',
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({ data }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const lastVisitedSpaces = await getLastVisitedSpaces()

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      `
    id, name,
    user_space_presences!inner (last_seen_at)
  `
    )

    const expectedDateRange = new Date()
    expectedDateRange.setDate(expectedDateRange.getDate() - 3)

    expect(supabaseClient.from('spaces').select().gte).toHaveBeenCalledWith(
      'user_space_presences.last_seen_at',
      expectedDateRange.toISOString()
    )

    expect(lastVisitedSpaces).toEqual(camelcaseKeys(data))

    vi.useFakeTimers()
  })

  test('returns null if no joined spaces found', async () => {
    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({ data: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const lastVisitedSpaces = await getLastVisitedSpaces()

    expect(lastVisitedSpaces).toEqual(null)
  })
})
