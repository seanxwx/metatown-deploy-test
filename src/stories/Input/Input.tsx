import { Search } from 'lucide-react'
import React, { FC } from 'react'

const Logo: FC = () => (
  <div className="space-y-8">
    <div>
      <div>
        <input className="box-border h-12 w-full rounded-lg border border-neutral-400 bg-white px-4 text-neutral-900" />
      </div>
    </div>
    <div className="space-y-4">
      <p>With prefix icon</p>
      <div className="relative">
        <input className="box-border h-12 w-full rounded-lg border border-neutral-400 bg-white pl-12 pr-4 text-neutral-900" />
        <div className="absolute bottom-0 left-0 top-0 flex items-center pl-4">
          <Search className="text-neutral-400" />
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <p>With suffix icon</p>
      <div className="relative">
        <input className="box-border h-12 w-full rounded-lg border border-neutral-400 bg-white pl-4 pr-12 text-neutral-900" />
        <div className="absolute bottom-0 right-0 top-0 flex items-center pr-4">
          <Search className="text-neutral-400" />
        </div>
      </div>
    </div>
  </div>
)

export default Logo
