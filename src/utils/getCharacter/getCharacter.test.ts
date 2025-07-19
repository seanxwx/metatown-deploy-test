import getCachedAsset from '@/utils/getCachedAsset'
import { CHARACTER, isCharacter } from './getCharacter'

vi.mock('@/utils/getCachedAsset')
const getCachedAssetMock = vi.mocked(getCachedAsset)

describe('getCharacter', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('loads character image', async () => {
    const { default: getCharacter } = await import('./getCharacter')

    const image = new Image()
    getCachedAssetMock.mockResolvedValue(image)

    const character = 'FEMALE_01'
    const result = await getCharacter(character)

    expect(result).toBe(image)
    expect(getCachedAssetMock).toHaveBeenCalledWith(
      character,
      CHARACTER[character]
    )
  })
})

describe('isCharacter', () => {
  test('returns true for valid character', () => {
    const result = isCharacter('FEMALE_01')
    expect(result).toBe(true)
  })

  test('returns false for invalid character', () => {
    const result = isCharacter('INVALID_CHARACTER')
    expect(result).toBe(false)
  })
})
