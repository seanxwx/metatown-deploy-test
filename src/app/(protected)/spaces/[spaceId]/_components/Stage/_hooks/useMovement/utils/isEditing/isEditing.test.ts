import isEditing, { EDITABLE_TAGS } from './isEditing'

describe('isEditing', () => {
  test.each(EDITABLE_TAGS)('isEditing returns true for %s tag', (tag) => {
    const event = new KeyboardEvent('keydown')

    const element = document.createElement(tag)

    Object.defineProperty(event, 'target', {
      get: () => element,
    })

    expect(isEditing(event)).toBe(true)
  })

  test('isEditing returns true for contenteditable element', () => {
    const event = new KeyboardEvent('keydown')

    const element = document.createElement('div')
    element.setAttribute('contenteditable', 'true')

    Object.defineProperty(event, 'target', {
      get: () => element,
    })

    expect(isEditing(event)).toBe(true)
  })

  test('isEditing returns false for non-editable element', () => {
    const event = new KeyboardEvent('keydown')

    const element = document.createElement('div')

    Object.defineProperty(event, 'target', {
      get: () => element,
    })

    expect(isEditing(event)).toBe(false)
  })

  test('isEditing returns false when target is not an element', () => {
    const event = new KeyboardEvent('keydown')

    Object.defineProperty(event, 'target', {
      get: () => null,
    })

    expect(isEditing(event)).toBe(false)
  })
})
