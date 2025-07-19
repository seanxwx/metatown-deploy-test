import { render, screen } from '@testing-library/react'
import Social, { SOCIALS } from './Social'

describe('Social', () => {
  test.each(SOCIALS)('renders %s icon', async (social) => {
    render(<Social />)

    expect(
      await screen.findByRole('button', { name: social })
    ).toBeInTheDocument()
  })
})
