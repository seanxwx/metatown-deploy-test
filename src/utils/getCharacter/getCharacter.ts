import getAsset from '@/utils/getCachedAsset'
import blackCat from './assets/black-cat.png'
import cat from './assets/cat.png'
import female01 from './assets/female-01.png'
import female02 from './assets/female-02.png'
import female03 from './assets/female-03.png'
import female04 from './assets/female-04.png'
import female05 from './assets/female-05.png'
import male01 from './assets/male-01.png'
import male02 from './assets/male-02.png'
import male03 from './assets/male-03.png'
import male04 from './assets/male-04.png'
import male05 from './assets/male-05.png'

export const CHARACTER = {
  FEMALE_01: female01.src,
  FEMALE_02: female02.src,
  FEMALE_03: female03.src,
  FEMALE_04: female04.src,
  FEMALE_05: female05.src,
  MALE_01: male01.src,
  MALE_02: male02.src,
  MALE_03: male03.src,
  MALE_04: male04.src,
  MALE_05: male05.src,
  CAT: cat.src,
  BLACK_CAT: blackCat.src,
} as const

export type Character = keyof typeof CHARACTER

export const SPRITE_SIZE = 32

export const CHARACTERS: Character[] = Object.keys(CHARACTER) as Character[]

export const isCharacter = (character: string): character is Character =>
  CHARACTERS.includes(character as Character)

const getCharacter = (
  character: Character
): HTMLImageElement | Promise<HTMLImageElement> =>
  getAsset(character, CHARACTER[character])

export default getCharacter
