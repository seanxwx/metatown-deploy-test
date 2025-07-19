import createAudio from './createAudio'

describe('createAudio', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('returns audio context mixer', () => {
    const mediaStreamDestination = {
      stream: {},
    }

    const oscillator = {
      frequency: {
        setValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }

    const audionContext = {
      createMediaStreamDestination: vi
        .fn()
        .mockReturnValue(mediaStreamDestination),
      createOscillator: vi.fn().mockReturnValue(oscillator),
      currentTime: 0,
      close: vi.fn(),
    }

    const AudionContext = vi.fn().mockReturnValue(audionContext)

    vi.stubGlobal('AudioContext', AudionContext)

    const result = createAudio()

    expect(AudionContext).toHaveBeenCalled()

    expect(audionContext.createMediaStreamDestination).toHaveBeenCalled()

    expect(audionContext.createOscillator).toHaveBeenCalled()
    expect(oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
      0,
      audionContext.currentTime
    )
    expect(oscillator.connect).toHaveBeenCalledWith(mediaStreamDestination)
    expect(oscillator.start).toHaveBeenCalled()

    expect(result.stream).toBe(mediaStreamDestination.stream)

    result.cleanup()
    expect(oscillator.stop).toHaveBeenCalled()
    expect(audionContext.close).toHaveBeenCalled()
  })

  test('returns audio context mixer with added track', () => {
    const mediaStreamDestination = {
      stream: {},
    }

    const oscillator = {
      frequency: {
        setValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
    }

    const streamSource = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }

    const audionContext = {
      createMediaStreamDestination: vi
        .fn()
        .mockReturnValue(mediaStreamDestination),
      createOscillator: vi.fn().mockReturnValue(oscillator),
      createMediaStreamSource: vi.fn().mockReturnValue(streamSource),
      currentTime: 0,
      close: vi.fn(),
    }

    const AudionContext = vi.fn().mockReturnValue(audionContext)

    vi.stubGlobal('AudioContext', AudionContext)

    const result = createAudio()

    const track = {
      kind: 'audio',
    } as MediaStreamTrack

    vi.stubGlobal('MediaStream', vi.fn().mockReturnValue({}))

    result.addTrack(track)

    expect(audionContext.createMediaStreamSource).toHaveBeenCalledWith(
      new MediaStream([track])
    )

    expect(streamSource.connect).toHaveBeenCalledWith(mediaStreamDestination)

    result.addTrack(track)

    expect(audionContext.createMediaStreamSource).toHaveBeenCalledTimes(1)
    expect(streamSource.connect).toHaveBeenCalledTimes(1)

    result.removeTrack(track)

    expect(streamSource.disconnect).toHaveBeenCalledWith(mediaStreamDestination)

    result.removeTrack(track)

    expect(streamSource.disconnect).toHaveBeenCalledTimes(1)
  })

  test('does not add track if track kind is not audio', () => {
    const streamSource = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }

    const audionContext = {
      createMediaStreamDestination: vi.fn().mockReturnValue({
        stream: {},
      }),
      createOscillator: vi.fn().mockReturnValue({
        frequency: {
          setValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        start: vi.fn(),
      }),
      createMediaStreamSource: vi.fn().mockReturnValue(streamSource),
      currentTime: 0,
      close: vi.fn(),
    }

    const AudionContext = vi.fn().mockReturnValue(audionContext)

    vi.stubGlobal('AudioContext', AudionContext)

    const result = createAudio()

    const track = {
      kind: 'video',
    } as MediaStreamTrack

    result.addTrack(track)

    expect(audionContext.createMediaStreamSource).not.toHaveBeenCalled()
    expect(streamSource.connect).not.toHaveBeenCalled()

    result.removeTrack(track)

    expect(streamSource.disconnect).not.toHaveBeenCalled()
  })
})
