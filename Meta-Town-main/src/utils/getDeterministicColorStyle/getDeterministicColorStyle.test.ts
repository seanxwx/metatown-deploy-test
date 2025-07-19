import getDeterministicColorStyle from './getDeterministicColorStyle'

describe('getDeterministicColorStyle', () => {
  test('returns white text on dark background', () => {
    const { backgroundColor, color } = getDeterministicColorStyle(
      '8a160c5c-b1c1-46f2-b170-fd4bee656307'
    )

    expect(backgroundColor).toBe('#edba67')
    expect(color).toBe('black')
  })

  test('returns black text on light background', () => {
    const { backgroundColor, color } = getDeterministicColorStyle(
      'f4ecd06e-62c2-4cc0-865f-1d8e40c033cc'
    )

    expect(backgroundColor).toBe('#38da1c')
    expect(color).toBe('white')
  })
})
