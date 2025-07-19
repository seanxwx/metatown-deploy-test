describe('getCachedAsset', () => {
  afterEach(() => {
    vi.resetModules()
  })

  test('loads character image', async () => {
    const { default: getCachedAsset } = await import('./getCachedAsset')

    const name = 'FEMALE_01'
    const src = 'SRC'

    const image = {} as unknown as HTMLImageElement
    const Image = vi.fn().mockReturnValue(image)
    vi.stubGlobal('Image', Image)

    const promise = getCachedAsset(name, src)

    expect(image.src).toBe(src)
    expect(image.onload).toBeDefined()

    image.onload!({} as Event)

    const result = await promise

    expect(result).toBe(image)
  })

  test('gets cached character image', async () => {
    const { default: getCachedAsset } = await import('./getCachedAsset')

    const name = 'FEMALE_01'
    const src = 'SRC'

    const image = {} as unknown as HTMLImageElement
    const Image = vi.fn().mockReturnValue(image)
    vi.stubGlobal('Image', Image)

    const promise = getCachedAsset(name, src)

    image.onload!({} as Event)

    await promise

    const result = getCachedAsset(name, src)

    expect(Image).toHaveBeenCalledTimes(1)

    expect(result).toBe(image)
  })

  test('throws error on image load failure', async () => {
    const { default: getCachedAsset } = await import('./getCachedAsset')

    const image = {} as unknown as HTMLImageElement
    const Image = vi.fn().mockReturnValue(image)
    vi.stubGlobal('Image', Image)

    await expect(() => {
      const promise = getCachedAsset('FEMALE_01', 'SRC')

      image.onerror!({} as Event)

      return promise
    }).rejects.toThrow()
  })
})
