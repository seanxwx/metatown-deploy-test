import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getOwnedSpaces from './getOwnedSpaces'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getOwnedSpaces', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns spaces', async () => {
    const OWNER_ID = 'OWNER_ID'

    const data = {
      id: 'ID',
      name: 'Space Name',
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({ data }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spaces = await getOwnedSpaces(['spaces', OWNER_ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      'id, name'
    )

    expect(supabaseClient.from('spaces').select().eq).toHaveBeenCalledWith(
      'owner_id',
      OWNER_ID
    )

    expect(spaces).toEqual(camelcaseKeys(data))
  })

  test('returns null if spaces not found', async () => {
    const OWNER_ID = 'OWNER_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({ data: null }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spaces = await getOwnedSpaces(['spaces', OWNER_ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      'id, name'
    )

    expect(supabaseClient.from('spaces').select().eq).toHaveBeenCalledWith(
      'owner_id',
      OWNER_ID
    )

    expect(spaces).toEqual(null)
  })
})
