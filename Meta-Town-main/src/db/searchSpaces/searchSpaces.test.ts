import camelcaseKeys from 'camelcase-keys'
import { describe, test, expect, vi } from 'vitest'
import createSupabaseClient from '@/utils/createSupabaseClient'
import searchSpaces from './searchSpaces'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('searchSpaces', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns spaces with provided query', async () => {
    const query = 'query'

    const data = {
      id: 'ID',
      name: 'Space Name',
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          ilike: vi.fn().mockReturnValue({ data }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spaces = await searchSpaces(['spaces', query])

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      'id, name'
    )

    expect(
      supabaseClient.from('spaces').select('id,name').ilike
    ).toHaveBeenCalledWith('name', `%${query}%`)

    expect(spaces).toEqual(camelcaseKeys(data))
  })

  test('returns null if spaces not found', async () => {
    const query = 'query'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          ilike: vi.fn().mockReturnValue({ data: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spaces = await searchSpaces(['spaces', query])

    expect(spaces).toBeNull()
  })
})
