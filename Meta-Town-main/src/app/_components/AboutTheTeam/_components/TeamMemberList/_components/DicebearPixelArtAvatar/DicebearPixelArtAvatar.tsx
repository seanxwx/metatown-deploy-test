import { FC } from 'react'
import Image from 'next/image'

interface Props {
  seed: string
}

const getAvatarUrl = (seed: string): string =>
  `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`

const DicebearPixelArtAvatar: FC<Props> = ({ seed }) => (
  <Image
    src={getAvatarUrl(seed)}
    alt="Avatar"
    width={48}
    height={48}
    className="h-8 w-8 md:h-12 md:w-12"
  />
)

export default DicebearPixelArtAvatar
