import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Navigation, { ACTIVE, LINKS } from './Navigation'

vi.mock('next/navigation')
const usePathnameMock = vi.mocked(usePathname)

describe('Navigation', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each(LINKS)('renders $name link', ({ name, href }) => {
    render(<Navigation />)

    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  })

  test.each(LINKS)('renders active $name link', ({ name, href }) => {
    usePathnameMock.mockReturnValue(href)
    render(<Navigation />)

    expect(screen.getByRole('link', { name })).toHaveClass(ACTIVE)
  })
})
