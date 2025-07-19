import { Search } from 'lucide-react'
import React, { FC } from 'react'

const TextField: FC = () => (
  <div className="space-y-10">
    <div className="flex space-x-8">
      <div>
        <label
          className="mb-1 block text-sm text-neutral-600"
          htmlFor="TEXT_FIELD"
        >
          Text Field
        </label>
        <input
          id="TEXT_FIELD"
          className="box-border h-12 w-full rounded-lg border border-neutral-400 bg-white px-4 text-neutral-900"
        />
      </div>
      <div>
        <label
          className="mb-1 block text-sm text-neutral-600"
          htmlFor="TEXT_FIELD_MESSAGE"
        >
          With Input Props
        </label>
        <div className="relative">
          <input
            id="TEXT_FIELD_MESSAGE"
            className="box-border h-12 w-full rounded-lg border border-neutral-400 bg-white pl-12 pr-4 text-neutral-900"
          />
          <div className="absolute bottom-0 left-0 top-0 flex items-center pl-4">
            <Search className="text-neutral-400" />
          </div>
        </div>
      </div>
    </div>

    <div className="flex space-x-8">
      <div>
        <label
          className="mb-1 block text-sm text-rose-500"
          htmlFor="TEXT_FIELD_ERROR"
        >
          Text Field
        </label>
        <input
          id="TEXT_FIELD_ERROR"
          className="box-border h-12 w-full rounded-lg border border-rose-500 bg-white px-4 text-neutral-900"
        />
        <div className="mt-1 text-sm text-rose-500">Incorrect entry</div>
      </div>
    </div>
  </div>
)

export default TextField
