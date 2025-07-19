import getCachedAsset from '@/utils/getCachedAsset'
import getAsset, { ASSET } from './getAsset'

vi.mock('@/utils/getCachedAsset')
const getCachedAssetMock = vi.mocked(getCachedAsset)

describe('getAsset', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each(Object.keys(ASSET))(
    'get assets from cached asset: %s',
    async (name) => {
      const key = name as keyof typeof ASSET

      const image = {} as HTMLImageElement

      getCachedAssetMock.mockResolvedValue(image)

      const src = ASSET[key]
      const result = await getAsset(key)

      expect(getCachedAssetMock).toHaveBeenCalledWith(key, src)
      expect(result).toBe(image)
    }
  )
})
