import getCachedAsset from '@/utils/getCachedAsset'
import wall from './assets/wall.png'
import ground from './assets/ground.png'
import chair from './assets/chair.png'

export const ASSET = {
  wall: wall.src,
  ground: ground.src,
  chair: chair.src,
}

export const SPRITE_SIZE = 48

const getAsset = (
  key: keyof typeof ASSET
): HTMLImageElement | Promise<HTMLImageElement> =>
  getCachedAsset(key, ASSET[key])

export default getAsset
