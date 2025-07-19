import { render, screen, within } from '@testing-library/react'
import LinkToSpace from './LinkToSpace'

describe('LinkToSpace', () => {
  test('renders link with provided children', () => {
    render(<LinkToSpace spaceID="12345">Placeholder</LinkToSpace>)
    expect(screen.getByText('Placeholder')).toBeInTheDocument()
  })

  test('renders link to the space page', () => {
    render(<LinkToSpace spaceID="12345">Placeholder</LinkToSpace>)
    expect(screen.getByRole('link', { name: /Placeholder/i })).toHaveAttribute(
      'href',
      '/spaces/12345'
    )
  })

  test('renders link with a hover style', () => {
    render(<LinkToSpace spaceID="12345">Placeholder</LinkToSpace>)

    expect(screen.getByRole('link', { name: /Placeholder/i })).toHaveClass(
      'group hover:border-gray-300'
    )

    expect(
      within(screen.getByRole('link', { name: /Placeholder/i })).getByRole(
        'presentation'
      )
    ).toHaveClass('opacity-0 group-hover:opacity-100')
  })

  test('renders Login icon', () => {
    render(<LinkToSpace spaceID="12345">Placeholder</LinkToSpace>)

    expect(screen.getByLabelText('Enter this space')).toBeInTheDocument()
  })
})
