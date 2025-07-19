import clamp from './clamp'

describe('clamp', () => {
  test('clamps value to min', () => {
    expect(clamp(-1, 0, 1)).toBe(0)
  })

  test('clamps value to max', () => {
    expect(clamp(2, 0, 1)).toBe(1)
  })

  test('does not clamp value', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5)
  })
})
