import isConfigurable from './isDeleting'

describe('isConfigurable', () => {
  test('returns true if type is delete', () => {
    const result = isConfigurable(
      { x: 1, y: 2 },
      { x: 1, y: 2, direction: 'E', type: 'delete' }
    )
    expect(result).toBe(true)
  })

  test('returns false if coordinates do not match', () => {
    const result = isConfigurable(
      { x: 3, y: 4 },
      { x: 1, y: 2, direction: 'E', type: 'entry' }
    )
    expect(result).toBe(false)
  })

  test('returns false if configPosition is null', () => {
    const result = isConfigurable({ x: 1, y: 2 }, null)

    expect(result).toBe(false)
  })
})
