import { Ham, Nut } from 'lucide-react'
import { FC } from 'react'

const Button: FC = () => (
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
          <button className="h-12 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-white outline-offset-4 hover:bg-neutral-700">
            Button
          </button>
        </td>
        <td>
          <button className="h-12 rounded-lg border border-neutral-400 bg-white px-4 text-neutral-900 outline-offset-4 hover:bg-neutral-200">
            Button
          </button>
        </td>
        <td>
          <button className="h-12 rounded-lg border border-transparent px-4 text-neutral-900 outline-offset-4 hover:bg-neutral-200">
            Button
          </button>
        </td>
        <td>
          <button className="h-12 rounded-lg border border-emerald-500 bg-emerald-500 px-4 text-white outline-offset-4 hover:bg-emerald-700">
            Button
          </button>
        </td>
        <td>
          <button className="h-12 rounded-lg border border-amber-500 bg-amber-500 px-4 text-white outline-offset-4 hover:bg-amber-700">
            Button
          </button>
        </td>
        <td>
          <button className="h-12 rounded-lg border border-rose-500 bg-rose-500 px-4 text-white outline-offset-4 hover:bg-rose-700">
            Button
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
        <td>With prefix Icon</td>
        <td>
          <button className="inline-flex h-12 items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-white outline-offset-4 hover:bg-neutral-700">
            <Nut />
            Button
          </button>
        </td>
      </tr>
      <tr>
        <td>With suffix Icon</td>
        <td>
          <button className="inline-flex h-12 items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-white outline-offset-4 hover:bg-neutral-700">
            Button
            <Ham />
          </button>
        </td>
      </tr>
      <tr>
        <td>Large</td>
        <td>
          <button className="h-14 rounded-lg border border-neutral-900 bg-neutral-900 px-8 text-lg text-white outline-offset-4 hover:bg-neutral-700">
            Button
          </button>
        </td>
      </tr>
      <tr>
        <td>Small</td>
        <td>
          <button className="h-10 rounded-lg border border-neutral-900 bg-neutral-900 px-2 text-sm text-white outline-offset-4 hover:bg-neutral-700">
            Button
          </button>
        </td>
      </tr>
    </tbody>
  </table>
)

export default Button
