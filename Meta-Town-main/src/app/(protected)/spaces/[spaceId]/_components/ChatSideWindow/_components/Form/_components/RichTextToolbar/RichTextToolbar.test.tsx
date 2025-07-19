import { render, screen } from '@testing-library/react'
import { Editor } from '@tiptap/react'
import userEvent from '@testing-library/user-event'
import { VARIANT } from '@/components/Button'
import RichTextToolbar, { FORMATTING_BUTTONS } from './RichTextToolbar'

describe('RichTextToolbar', () => {
  test('renders mention button', async () => {
    const editor = {
      isActive: vi.fn(),
    } as unknown as Editor

    render(<RichTextToolbar editor={editor} />)

    expect(
      await screen.findByRole('button', { name: 'Mention someone' })
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Mention someone' })
    ).toHaveClass(VARIANT.naked)
  })

  test.each(FORMATTING_BUTTONS)('renders %s button', async ({ label }) => {
    const editor = {
      isActive: () => false,
    } as unknown as Editor

    render(<RichTextToolbar editor={editor} />)

    expect(
      await screen.findByRole('button', { name: label })
    ).toBeInTheDocument()

    expect(await screen.findByRole('button', { name: label })).toHaveClass(
      VARIANT.naked
    )
  })

  test.each(FORMATTING_BUTTONS)(
    'calls editor command %s when %s button is clicked',
    async ({ label, command }) => {
      const run = vi.fn()

      const editor = {
        isActive: () => false,
        chain: (): {
          focus: () => Record<string, () => { run: () => void }>
        } => ({
          focus: () => ({
            [command]: () => ({
              run,
            }),
          }),
        }),
      } as unknown as Editor

      const user = userEvent.setup()
      render(<RichTextToolbar editor={editor} />)

      await user.click(await screen.findByRole('button', { name: label }))

      expect(run).toBeCalled()
    }
  )

  test.each(FORMATTING_BUTTONS)(
    'renders %s button with success variant when %s button is clicked',
    async ({ type: formatType, label, command }) => {
      const editor = {
        isActive: (type: string) => type === formatType,
        chain: (): {
          focus: () => Record<string, () => { run: () => void }>
        } => ({
          focus: () => ({
            [command]: () => ({
              run: vi.fn(),
            }),
          }),
        }),
      } as unknown as Editor

      const user = userEvent.setup()
      const { rerender } = render(<RichTextToolbar editor={editor} />)

      await user.click(await screen.findByRole('button', { name: label }))

      rerender(<RichTextToolbar editor={editor} />)

      expect(await screen.findByRole('button', { name: label })).toHaveClass(
        VARIANT.success
      )
    }
  )
})
