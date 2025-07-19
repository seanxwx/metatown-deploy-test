import { FC } from 'react'
import FunctionList from './_components/FunctionList'

const Functions: FC = () => (
  <>
    <div className="space-y-10 text-white md:space-y-28">
      <h2 className="text-center text-2xl font-medium md:text-5xl">
        Everything You Need To Telecommuter in Meta Town
      </h2>
      <FunctionList />
    </div>
  </>
)

export default Functions
