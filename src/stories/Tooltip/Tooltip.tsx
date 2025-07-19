import { Beer } from 'lucide-react'
import { FC } from 'react'

const Tooltip: FC = () => (
  <div>
    <section className="space-y-8">
      <div className="space-y-12">
        <div>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-400 bg-white text-neutral-900 outline-offset-4 hover:bg-neutral-200">
            <Beer />
          </button>
          <div className="relative mt-1">
            <div className="absolute left-0 text-nowrap rounded bg-neutral-800 px-3 py-1 text-white">
              Left Left Left
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button className="h-12 rounded-lg border border-transparent px-4 text-neutral-900 outline-offset-4 hover:bg-neutral-200">
            Button
          </button>
          <div className="relative mt-1">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 text-nowrap rounded bg-neutral-800 px-3 py-1 text-white">
              Center Center Center
            </div>
          </div>
        </div>
        <div className="w-fit">
          <div>Storybook</div>
          <div className="relative mt-1">
            <div className="absolute right-0 text-nowrap rounded bg-neutral-800 px-3 py-1 text-white">
              Right Right Right
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

export default Tooltip
