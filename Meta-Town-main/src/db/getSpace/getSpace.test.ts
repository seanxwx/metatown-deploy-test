import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getSpace from './getSpace'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getSpace', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns space', async () => {
    const spaceId = 'SPACE_ID'

    const data = {
      id: spaceId,
      name: 'Test Space',
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({ data }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const space = await getSpace(['space', spaceId])

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      'id, name'
    )

    expect(
      supabaseClient.from('spaces').select('id, name').eq
    ).toHaveBeenCalledWith('id', spaceId)

    expect(
      supabaseClient.from('spaces').select('id, name').eq('id', spaceId).single
    ).toHaveBeenCalled()

    expect(space).toEqual(camelcaseKeys(data))
  })

  test('returns null if space is not found', async () => {
    const spaceId = 'SPACE_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({ data: null }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const result = await getSpace(['space', spaceId])

    expect(result).toEqual(null)
  })
})
