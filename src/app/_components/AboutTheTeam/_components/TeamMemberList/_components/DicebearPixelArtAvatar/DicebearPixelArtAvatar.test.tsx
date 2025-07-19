import { render, screen } from '@testing-library/react'
import DicebearPixelArtAvatar from './DicebearPixelArtAvatar'

describe('DicebearPixelArtAvatar', () => {
  test('renders avatar with given seed', () => {
    const seed = 'Nolan'

    render(<DicebearPixelArtAvatar seed={seed} />)

    expect(
      screen.getByRole('img', { name: 'Avatar' }).getAttribute('src')
    ).toContain(seed)
  })
})
