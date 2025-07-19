import { Dimensions, Ground } from '@/app/types'

const prepareGrounds = (
  dimensions: Dimensions,
  grounds?: Ground[] | null
): Ground[] | undefined =>
  grounds?.filter(
    (ground) => ground.x < dimensions.columns && ground.y < dimensions.rows
  )

export default prepareGrounds
