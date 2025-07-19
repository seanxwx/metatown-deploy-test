import { Beer } from 'lucide-react'
import { FC } from 'react'

const Icon: FC = () => (
  <table className="border-separate border-spacing-4 text-center">
    <thead>
      <tr>
        <th />
        <th>Primary</th>
        <th>Secondary</th>
        <th>Naked</th>
        <th>Success</th>
        <th>Warning</th>
        <th>Danger</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Default</td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-900 bg-neutral-900 text-white outline-offset-4 hover:bg-neutral-700">
            <Beer />
          </button>
        </td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-400 bg-white text-neutral-900 outline-offset-4 hover:bg-neutral-200">
            <Beer />
          </button>
        </td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent text-neutral-900 outline-offset-4 hover:bg-neutral-200">
            <Beer />
          </button>
        </td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500 bg-emerald-500 text-white outline-offset-4 hover:bg-emerald-700">
            <Beer />
          </button>
        </td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500 bg-amber-500 text-white outline-offset-4 hover:bg-amber-700">
            <Beer />
          </button>
        </td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500 bg-rose-500 text-white outline-offset-4 hover:bg-rose-700">
            <Beer />
          </button>
        </td>
      </tr>
      <tr>
        <td>Circle</td>
        <td>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 text-white outline-offset-4 hover:bg-neutral-700">
            <Beer />
          </button>
        </td>
      </tr>
      <tr>
        <td>Hover</td>
        <td colSpan={6}>
          <p className="flex h-12 items-center justify-center">
            Please use the Mouse to hover onto the button to check the hover
            style.
          </p>
        </td>
      </tr>
      <tr>
        <td>Active / Focus</td>
        <td colSpan={6}>
          <p className="flex h-12 items-center justify-center">
            Please use the Tab key to move the cursor onto the button to check
            the active style.
          </p>
        </td>
      </tr>
      <tr>
        <td>Large</td>
        <td>
          <button className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-900 bg-neutral-900 text-lg text-white outline-offset-4 hover:bg-neutral-700">
            <Beer />
          </button>
        </td>
      </tr>
      <tr>
        <td>Small</td>
        <td>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-900 bg-neutral-900 text-white outline-offset-4 hover:bg-neutral-700">
            <Beer />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
)

export default Icon
