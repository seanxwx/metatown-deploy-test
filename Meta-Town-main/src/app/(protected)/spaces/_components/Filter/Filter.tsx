import { FC } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'

export type Type = 'owned' | 'lastVisited' | 'searched'

interface Props {
  onToggleSpaces: (type: Type) => void
  type?: Type
  searchQuery?: string
  onSearch: (value: string) => void
}

const Filter: FC<Props> = ({
  onToggleSpaces,
  type = 'owned',
  searchQuery = '',
  onSearch,
}) => (
  <div className="flex justify-end pb-6 pt-12 text-white">
    <Button
      variant={type === 'lastVisited' ? 'primary' : 'light'}
      onClick={() => onToggleSpaces('lastVisited')}
      className="mr-4"
    >
      Last visited
    </Button>

    <Button
      variant={type === 'owned' ? 'primary' : 'light'}
      onClick={() => onToggleSpaces('owned')}
      className="mr-8"
    >
      Created Spaces
    </Button>
    <Input
      prefix={{ name: 'search', label: 'Search' }}
      value={searchQuery}
      onChange={(event) => {
        const value = event.target.value

        onSearch(value)

        if (value.length < 3) {
          return
        }
        onToggleSpaces('searched')
      }}
      placeholder="Start searching..."
      aria-label="Search"
    />
  </div>
)

export default Filter
