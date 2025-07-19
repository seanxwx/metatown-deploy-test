import createVideo from './createVideo'

describe('createVideo', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('throws error if canvas is not supported', () => {
    const canvas = {
      getContext: vi.fn().mockReturnValue(null),
    }

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(canvas as unknown as HTMLCanvasElement)

    expect(() => createVideo()).toThrowError()

    createElementSpy.mockRestore()
  })

  test('returns canvas stream', () => {
    vi.useFakeTimers()

    const frame = 1

    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame')
    requestAnimationFrameSpy.mockReturnValue(frame)

    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      fillStyle: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const stream = {} as MediaStream

    const canvas = {
      getContext: vi.fn().mockReturnValue(context),
      captureStream: vi.fn().mockReturnValue(stream),
    } as unknown as HTMLCanvasElement

    const video = {} as HTMLVideoElement

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string): HTMLElement => {
        if (tagName === 'canvas') {
          return canvas
        }
        if (tagName === 'video') {
          return video
        }

        throw new Error()
      })

    const result = createVideo()

    expect(document.createElement).toHaveBeenCalledWith('canvas')
    expect(canvas.getContext).toHaveBeenCalledWith('2d')

    expect(document.createElement).toHaveBeenCalledWith('video')

    expect(window.requestAnimationFrame).toHaveBeenCalled()

    expect(canvas.captureStream).toHaveBeenCalledWith(30)
    expect(result.stream).toBe(stream)

    result.cleanup()

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(frame)

    requestAnimationFrameSpy.mockRestore()
    cancelAnimationFrameSpy.mockRestore()

    createElementSpy.mockRestore()

    vi.useRealTimers()
  })

  test('returns placeholder if there is no video', () => {
    vi.useFakeTimers()

    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      fillStyle: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const stream = {} as MediaStream

    const canvas = {
      getContext: vi.fn().mockReturnValue(context),
      captureStream: vi.fn().mockReturnValue(stream),
    } as unknown as HTMLCanvasElement

    const video = {} as HTMLVideoElement

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string): HTMLElement => {
        if (tagName === 'canvas') {
          return canvas
        }
        if (tagName === 'video') {
          return video
        }

        throw new Error()
      })

    createVideo()

    expect(document.createElement).toHaveBeenCalledWith('canvas')
    expect(canvas.getContext).toHaveBeenCalledWith('2d')

    expect(document.createElement).toHaveBeenCalledWith('video')

    expect(canvas.width).toBe(1280)
    expect(canvas.height).toBe(720)

    expect(context.fillRect).toHaveBeenCalledWith(
      0,
      0,
      canvas.width,
      canvas.height
    )

    expect(context.fillText).toHaveBeenCalledWith(
      new Date().toLocaleTimeString(),
      50,
      100
    )

    vi.advanceTimersToNextFrame()

    expect(context.fillRect).toHaveBeenCalledTimes(2)
    expect(context.fillText).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()

    vi.useRealTimers()
  })

  test('returns stream with added video track', () => {
    vi.useFakeTimers()

    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const stream = {} as MediaStream

    const canvas = {
      getContext: vi.fn().mockReturnValue(context),
      captureStream: vi.fn().mockReturnValue(stream),
    } as unknown as HTMLCanvasElement

    const mediaStream = {} as MediaStream
    const MediaStream = vi.fn().mockReturnValue(mediaStream)
    vi.stubGlobal('MediaStream', MediaStream)

    const video = {
      play: vi.fn(),
      readyState: 2,
      videoWidth: 1600,
      videoHeight: 1200,
    } as unknown as HTMLVideoElement

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string): HTMLElement => {
        if (tagName === 'canvas') {
          return canvas
        }
        if (tagName === 'video') {
          return video
        }

        throw new Error()
      })

    const result = createVideo()

    const track = {
      kind: 'video',
    } as MediaStreamTrack

    result.addTrack(track)

    expect(MediaStream).toHaveBeenCalledWith([track])

    expect(video.srcObject).toEqual(mediaStream)
    expect(video.play).toHaveBeenCalled()

    vi.advanceTimersToNextFrame()

    expect(canvas.width).toBe(video.videoWidth)
    expect(canvas.height).toBe(video.videoHeight)

    expect(context.drawImage).toHaveBeenCalledWith(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    vi.advanceTimersToNextFrame()

    expect(context.drawImage).toHaveBeenCalledTimes(2)

    result.removeTrack(track)

    expect(video.srcObject).toBeNull()

    vi.advanceTimersToNextFrame()

    expect(context.drawImage).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()

    vi.useRealTimers()
  })

  test('does not add non-video track to stream', () => {
    vi.useFakeTimers()

    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const stream = {} as MediaStream

    const canvas = {
      getContext: vi.fn().mockReturnValue(context),
      captureStream: vi.fn().mockReturnValue(stream),
    } as unknown as HTMLCanvasElement

    const video = {} as HTMLVideoElement

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string): HTMLElement => {
        if (tagName === 'canvas') {
          return canvas
        }
        if (tagName === 'video') {
          return video
        }

        throw new Error()
      })

    const result = createVideo()

    const track = {
      kind: 'audio',
    } as MediaStreamTrack

    result.addTrack(track)

    expect(video.srcObject).toBeUndefined()

    vi.advanceTimersToNextFrame()

    expect(context.drawImage).not.toHaveBeenCalled()

    result.removeTrack(track)

    expect(video.srcObject).toBeUndefined()

    vi.advanceTimersToNextFrame()

    expect(context.drawImage).not.toHaveBeenCalled()

    createElementSpy.mockRestore()

    vi.useRealTimers()
  })
})
