import { Beer, ChevronDown, Ham, Nut, Webcam } from 'lucide-react'
import { FC } from 'react'

const Dropdown: FC = () => (
  <div>
    <section className="space-y-8">
      <div className="flex gap-8">
        <div>
          <button className="h-12 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-white outline-offset-4 hover:bg-neutral-700">
            Button
          </button>
          <div className="mt-2">
            <div className="w-[300px] space-y-4 rounded border border-neutral-300 bg-white px-2 py-4">
              <ul className="space-y-2">
                <li className="px-2">
                  <span>Primary</span>
                </li>
                <li>
                  <button className="h-12 w-full rounded-lg border border-transparent px-4 text-left text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                  </button>
                </li>
                <li>
                  <button className="inline-flex h-12 w-full items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-left text-white outline-offset-4 hover:bg-neutral-700">
                    <Nut />
                    Button
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <ul className="space-y-2">
                <li className="px-2">Title</li>
                <li>
                  <button className="inline-flex h-12 w-full items-center justify-between rounded-lg border border-neutral-400 bg-white px-4 text-right text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                    <Ham />
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <li className="flex justify-end">
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-white outline-offset-4 hover:bg-rose-700">
                  <Beer />
                </button>
              </li>
            </div>
          </div>
        </div>
        <div>
          <div className="text-right">
            <button className="h-12 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-white outline-offset-4 hover:bg-neutral-700">
              Button
            </button>
          </div>
          <div className="mt-2">
            <div className="w-[300px] space-y-4 rounded border border-neutral-300 bg-neutral-100 px-2 py-4">
              <ul className="space-y-2">
                <li className="px-2">Secondary</li>
                <li>
                  <button className="h-12 w-full rounded-lg border border-transparent px-4 text-left text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                  </button>
                </li>
                <li>
                  <button className="inline-flex h-12 w-full items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-left text-white outline-offset-4 hover:bg-neutral-700">
                    <Nut />
                    Button
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <ul className="space-y-2">
                <li className="px-2">Title</li>
                <li>
                  <button className="inline-flex h-12 w-full items-center justify-between rounded-lg border border-neutral-400 bg-white px-4 text-right text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                    <Ham />
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <li className="flex justify-end">
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-white outline-offset-4 hover:bg-rose-700">
                  <Beer />
                </button>
              </li>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <div>
          <div className="mb-2">
            <div className="w-[200px] space-y-4 rounded border border-neutral-300 bg-white px-2 py-4">
              <ul className="space-y-2">
                <li>
                  <button className="h-12 w-full rounded-lg border border-transparent px-4 text-left text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                  </button>
                </li>
                <li>
                  <button className="inline-flex h-12 w-full items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-left text-white outline-offset-4 hover:bg-neutral-700">
                    <Nut />
                    Button
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <ul className="space-y-2">
                <li className="px-2">Title</li>
                <li>
                  <button className="inline-flex h-12 w-full items-center justify-between rounded-lg border border-neutral-400 bg-white px-4 text-right text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                    <Ham />
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <li className="flex justify-end">
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-white outline-offset-4 hover:bg-rose-700">
                  <Beer />
                </button>
              </li>
            </div>
          </div>
          <div>
            <div className="relative inline-flex h-12 text-white">
              <button className="relative z-10 mr-8 rounded-2xl bg-neutral-900 px-4 outline-offset-4 hover:bg-neutral-700">
                <Webcam className="mx-auto" />
              </button>
              <div className="absolute bottom-0 right-0 top-0 w-16 rounded-2xl bg-neutral-500 text-right hover:bg-neutral-700">
                <button className="h-full px-2 outline-offset-4">
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <div className="w-[400px] space-y-4 rounded border border-neutral-300 bg-white px-2 py-4">
              <ul className="space-y-2">
                <li>
                  <button className="h-12 w-full rounded-lg border border-transparent px-4 text-left text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                  </button>
                </li>
                <li>
                  <button className="inline-flex h-12 w-full items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-left text-white outline-offset-4 hover:bg-neutral-700">
                    <Nut />
                    Button
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <ul className="space-y-2">
                <li className="px-2">Title</li>
                <li>
                  <button className="inline-flex h-12 w-full items-center justify-between rounded-lg border border-neutral-400 bg-white px-4 text-right text-neutral-900 outline-offset-4 hover:bg-neutral-200">
                    Button
                    <Ham />
                  </button>
                </li>
              </ul>
              <hr className="border-neutral-300" />
              <li className="flex justify-end">
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-white outline-offset-4 hover:bg-rose-700">
                  <Beer />
                </button>
              </li>
            </div>
          </div>
          <div className="text-right">
            <button className="h-12 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-white outline-offset-4 hover:bg-neutral-700">
              Button
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
)

export default Dropdown
