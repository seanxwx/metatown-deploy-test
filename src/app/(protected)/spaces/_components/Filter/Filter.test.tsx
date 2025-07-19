import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VARIANT } from '@/components/Button'
import Filter from './Filter'

describe('Filter', () => {
  test('renders Last visited button', () => {
    render(<Filter onToggleSpaces={vi.fn()} onSearch={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Last visited' })
    ).toBeInTheDocument()
  })

  test('calls onToggleSpaces when Last visited button is clicked', async () => {
    const onToggleSpaces = vi.fn()
    const user = userEvent.setup()
    render(
      <Filter
        onToggleSpaces={onToggleSpaces}
        type="lastVisited"
        onSearch={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Last visited' }))
    expect(onToggleSpaces).toHaveBeenCalledWith('lastVisited')
  })

  test('renders Created Spaces button', () => {
    render(<Filter onToggleSpaces={vi.fn()} onSearch={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Created Spaces' })
    ).toBeInTheDocument()
  })

  test('calls onToggleSpaces when Created Spaces button is clicked', async () => {
    const onToggleSpaces = vi.fn()
    const user = userEvent.setup()
    render(<Filter onToggleSpaces={onToggleSpaces} onSearch={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Created Spaces' }))
    expect(onToggleSpaces).toHaveBeenCalledWith('owned')
  })

  test('calls onToggleSpaces with type searched when input value is 3 or more characters', () => {
    const onToggleSpaces = vi.fn()

    render(<Filter onToggleSpaces={onToggleSpaces} onSearch={vi.fn()} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: 'QUERY' },
    })

    expect(onToggleSpaces).toHaveBeenCalledWith('searched')
  })

  test('does not call onToggleSpaces when search value length is less than 3 characters', () => {
    const onToggleSpaces = vi.fn()

    render(<Filter onToggleSpaces={onToggleSpaces} onSearch={vi.fn()} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: 'QU' },
    })

    expect(onToggleSpaces).not.toHaveBeenCalled()
  })

  test('renders Last visited button with primary variant and Created Spaces button with light variant when type is lastVisited', () => {
    render(
      <Filter onToggleSpaces={vi.fn()} type="lastVisited" onSearch={vi.fn()} />
    )

    expect(screen.getByRole('button', { name: 'Last visited' })).toHaveClass(
      VARIANT.primary
    )

    expect(screen.getByRole('button', { name: 'Created Spaces' })).toHaveClass(
      VARIANT.light
    )
  })

  test('renders Last visited button with light variant and Created Spaces button with primary variant when type is owned', () => {
    render(<Filter onToggleSpaces={vi.fn()} type="owned" onSearch={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Last visited' })).toHaveClass(
      VARIANT.light
    )

    expect(screen.getByRole('button', { name: 'Created Spaces' })).toHaveClass(
      VARIANT.primary
    )
  })

  test('renders all buttons with light variant when type is searched', () => {
    render(
      <Filter onToggleSpaces={vi.fn()} type="searched" onSearch={vi.fn()} />
    )

    expect(screen.getByRole('button', { name: 'Last visited' })).toHaveClass(
      VARIANT.light
    )

    expect(screen.getByRole('button', { name: 'Created Spaces' })).toHaveClass(
      VARIANT.light
    )
  })

  test('renders Input', () => {
    render(<Filter onToggleSpaces={vi.fn()} onSearch={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument()
  })

  test('calls oSearch when input value changes', () => {
    const onSearch = vi.fn()
    const value = 'QUERY'

    render(<Filter onToggleSpaces={vi.fn()} onSearch={onSearch} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value },
    })

    expect(onSearch).toHaveBeenCalledWith(value)
  })
})
