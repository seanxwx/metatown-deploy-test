const CACHE: Partial<Record<string, HTMLImageElement>> = {}

const getCachedAsset = (
  name: string,
  src: string
): HTMLImageElement | Promise<HTMLImageElement> => {
  if (CACHE[name]) {
    return CACHE[name]
  }

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = src

    image.onload = (): void => {
      CACHE[name] = image

      resolve(image)
    }

    image.onerror = (): void => {
      reject(new Error())
    }
  })
}

export default getCachedAsset
