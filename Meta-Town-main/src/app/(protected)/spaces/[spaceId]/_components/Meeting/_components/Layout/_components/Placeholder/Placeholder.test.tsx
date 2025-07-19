import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Placeholder, { MAXIMIZED, NORMAL } from './Placeholder'

describe('Placeholder', () => {
  test('registers element', () => {
    const id = 'PLACEHOLDER'
    const ref = vi.fn()

    render(<Placeholder id={id} ref={ref} onFocus={vi.fn()} />)

    expect(ref).toHaveBeenCalledWith(
      screen.getByRole('presentation', { name: id })
    )
    expect(screen.getByRole('presentation', { name: id }).dataset.id).toBe(id)
  })

  test('calls onFocus when the focus button is clicked', async () => {
    const onFocus = vi.fn()

    const user = userEvent.setup()

    render(<Placeholder id="PLACEHOLDER" ref={vi.fn()} onFocus={onFocus} />)

    await user.click(await screen.findByRole('button', { name: 'Focus' }))

    expect(onFocus).toHaveBeenCalled()
  })

  test('renders with minimize and maximize button when focused', async () => {
    render(
      <Placeholder id="PLACEHOLDER" isFocused ref={vi.fn()} onFocus={vi.fn()} />
    )

    expect(
      await screen.findByRole('button', { name: 'Minimize' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Maximize' })
    ).toBeInTheDocument()
  })

  test('does not render maximize button when not focused', () => {
    render(<Placeholder id="PLACEHOLDER" ref={vi.fn()} onFocus={vi.fn()} />)

    expect(
      screen.queryByRole('button', { name: 'Maximize' })
    ).not.toBeInTheDocument()
  })

  test('renders with fullscreen when maximized', async () => {
    const user = userEvent.setup()

    render(
      <Placeholder id="PLACEHOLDER" isFocused ref={vi.fn()} onFocus={vi.fn()} />
    )

    expect(screen.getByRole('presentation')).toHaveClass(NORMAL)

    await user.click(await screen.findByRole('button', { name: 'Maximize' }))

    expect(screen.getByRole('presentation')).toHaveClass(MAXIMIZED)

    expect(
      await screen.findByRole('button', { name: 'Focus' })
    ).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: 'Focus' }))

    expect(screen.getByRole('presentation')).toHaveClass(NORMAL)
  })
})
