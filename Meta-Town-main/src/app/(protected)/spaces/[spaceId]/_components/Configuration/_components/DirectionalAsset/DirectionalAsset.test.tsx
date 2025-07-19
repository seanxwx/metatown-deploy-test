import { userEvent } from '@storybook/test'
import { render, screen } from '@testing-library/react'
import { VARIANT } from '@/components/Button'
import DirectionalAsset from './DirectionalAsset'

describe('DirectionalAsset', () => {
  test('renders title', () => {
    const title = 'Wall'

    render(
      <DirectionalAsset
        title={title}
        name="wall"
        onClick={vi.fn()}
        isActive={vi.fn()}
      />
    )

    expect(screen.getByText(title)).toBeInTheDocument()
  })

  test.each(['N', 'S', 'E', 'W'] as const)(
    'renders $s direction asset button',
    async (direction) => {
      const user = userEvent.setup()

      const name = 'wall'

      const onClick = vi.fn()
      const isActive = vi.fn().mockReturnValue(false)

      render(
        <DirectionalAsset
          title="Wall"
          name={name}
          onClick={onClick}
          isActive={isActive}
        />
      )

      expect(
        screen.getByRole('button', { name: `Asset: ${name} - ${direction}` })
      ).toBeInTheDocument()

      await user.click(
        screen.getByRole('button', { name: `Asset: ${name} - ${direction}` })
      )

      expect(onClick).toHaveBeenCalledWith(direction)
    }
  )

  test('renders selected button', () => {
    const name = 'wall'

    const onClick = vi.fn()

    const isActive = vi
      .fn()
      .mockImplementation((direction) => direction === 'N')

    render(
      <DirectionalAsset
        title="Wall"
        name={name}
        onClick={onClick}
        isActive={isActive}
      />
    )

    expect(
      screen.getByRole('button', { name: `Asset: ${name} - N` })
    ).toHaveClass(VARIANT.success)

    expect(
      screen.getByRole('button', { name: `Asset: ${name} - S` })
    ).toHaveClass(VARIANT.secondary)

    expect(
      screen.getByRole('button', { name: `Asset: ${name} - E` })
    ).toHaveClass(VARIANT.secondary)

    expect(
      screen.getByRole('button', { name: `Asset: ${name} - W` })
    ).toHaveClass(VARIANT.secondary)
  })
})
