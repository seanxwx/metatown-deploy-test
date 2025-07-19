import deleteLast from './deleteLast'

describe('deleteLast', () => {
  test('returns null when data is null', () => {
    const result = deleteLast(null, { x: 0, y: 0 })

    expect(result).toBeNull()
  })

  test('deletes the last item matching the target coordinates', () => {
    const data = [
      { x: 0, y: 0, createdAt: '2023-10-03T00:00:00Z' },
      { x: 0, y: 0, createdAt: '2023-10-01T00:00:00Z' },
      { x: 1, y: 1, createdAt: '2023-10-02T00:00:00Z' },
      { x: 2, y: 2, createdAt: '2023-10-04T00:00:00Z' },
    ]

    const result = deleteLast(data, { x: 0, y: 0 })

    expect(result).toEqual([data[1], data[2], data[3]])
  })

  test('returns original data when no matching item found', () => {
    const data = [
      { x: 0, y: 0, createdAt: '2023-10-03T00:00:00Z' },
      { x: 1, y: 1, createdAt: '2023-10-01T00:00:00Z' },
      { x: 2, y: 2, createdAt: '2023-10-02T00:00:00Z' },
    ]

    const result = deleteLast(data, { x: 3, y: 3 })

    expect(result).toEqual(data)
  })

  test('deletes the last timestamped item when there is no createdAt', () => {
    const data = [
      { x: 0, y: 0, createdAt: '2023-10-01T00:00:00Z' },
      { x: 0, y: 0 },
      { x: 1, y: 1, createdAt: '2023-10-02T00:00:00Z' },
      { x: 2, y: 2, createdAt: '2023-10-04T00:00:00Z' },
    ]

    const result = deleteLast(data, { x: 0, y: 0 })
    expect(result).toEqual([data[0], data[2], data[3]])
  })
})
