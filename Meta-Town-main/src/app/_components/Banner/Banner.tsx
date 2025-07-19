import { FC } from 'react'
import Image from 'next/image'
import Content from './_components/Content'
import banner from './assets/img/banner.png'

const Banner: FC = () => (
  <div className="flex flex-col gap-4 text-white lg:flex-row lg:gap-[5%]">
    <Content />
    <div className="self-center lg:w-3/5">
      <Image
        src={banner}
        width={600}
        height={480}
        alt="Banner"
        className="lg:aspect-5/4 lg:ml-auto"
      />
    </div>
  </div>
)

export default Banner
