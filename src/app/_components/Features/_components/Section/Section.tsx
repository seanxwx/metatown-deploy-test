import { FC } from 'react'
import Image, { StaticImageData } from 'next/image'
import { type IconName } from 'lucide-react/dynamic'
import { DynamicIcon } from 'lucide-react/dynamic'
import Chip from '@/components/Chip'

interface Props {
  chip: string
  description: {
    heading: string
    features: {
      icon: IconName
      subHeading: string
      paragraph: string
    }[]
  }
  image: {
    src: StaticImageData
    caption: string
    width: number
    height: number
  }
}

const Section: FC<Props> = ({ chip, description, image }) => (
  <section className="mb-16 justify-between md:mb-[200px] even:md:flex-row-reverse lg:flex lg:gap-x-12">
    <div className="mx-auto my-auto md:flex-none lg:max-w-lg lg:px-4">
      <div role="status" aria-label={chip}>
        <Chip>{chip}</Chip>
      </div>
      <h3 className="mt-2 text-[26px] font-bold text-[#2e2e2e] md:mt-4 md:text-5xl md:leading-[60px]">
        {description.heading}
      </h3>
      <ul className="md:mt-18 mt-6">
        {description.features.map(({ icon, subHeading, paragraph }) => (
          <li key={subHeading} className="mt-6 flex space-x-3 md:space-x-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f8f8] md:h-12 md:w-12">
              <DynamicIcon
                name={icon}
                className="h-[18px] w-[18px] md:h-6 md:w-6"
                aria-label={icon}
              />
            </div>
            <div className="flex-1 space-y-3 md:space-y-6">
              <p className="font-bold text-[#2e2e2e]">{subHeading}</p>
              <p className="max-w-prose break-words text-sm text-[#727272]">
                {paragraph}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="mx-auto mt-6 h-auto w-[343px] md:mt-12 md:w-[560px]">
      <Image
        src={image.src}
        alt={image.caption}
        width={image.width}
        height={image.height}
        className="size-full object-contain"
      />
    </div>
  </section>
)

export default Section
