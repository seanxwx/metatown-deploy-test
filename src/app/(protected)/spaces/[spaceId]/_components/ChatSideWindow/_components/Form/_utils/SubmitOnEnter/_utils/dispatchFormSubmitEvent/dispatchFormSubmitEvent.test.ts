import { Editor } from '@tiptap/core'
import dispatchFormSubmitEvent from './dispatchFormSubmitEvent'

describe('dispatchFormSubmitEvent', () => {
  test('dispatches form submit event and returns true when editor is inside a form', () => {
    const form = document.createElement('form')

    const element = document.createElement('div')
    form.appendChild(element)

    const editor = {
      options: {
        element,
      },
    } as unknown as Editor

    const handleSubmit = vi.fn()
    form.addEventListener('submit', handleSubmit)

    const result = dispatchFormSubmitEvent({ editor })

    expect(result).toBe(true)
    expect(handleSubmit).toHaveBeenCalled()
  })

  test('returns false if there is no parent form', () => {
    const element = document.createElement('div')

    const editor = {
      options: {
        element,
      },
    } as unknown as Editor

    const result = dispatchFormSubmitEvent({ editor })
    expect(result).toBe(false)
  })
})
