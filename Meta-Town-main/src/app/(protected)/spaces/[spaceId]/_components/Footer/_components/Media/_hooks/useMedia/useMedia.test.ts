import { renderHook } from '@testing-library/react'
import useMedia from './useMedia'

describe.each(['video', 'audio'] as const)('useMedia', (kind) => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test(`requests user ${kind} media stream`, async () => {
    const userMediaStream = {
      getTracks: (): MediaStreamTrack[] => [],
    } as unknown as MediaStream

    const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind }))

    const mediaStream = await result.current.requestMediaStream()

    expect(mediaStream).toEqual(userMediaStream)
  })

  test(`requests new ${kind} stream with device ID`, async () => {
    const deviceId = 'DEVICE_ID'

    const userMediaStream = {
      getTracks: (): MediaStreamTrack[] => [],
    } as unknown as MediaStream

    const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind }))

    const mediaStream = await result.current.requestMediaStream(deviceId)

    expect(mediaStream).toEqual(userMediaStream)

    expect(getUserMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        [kind]: expect.objectContaining({
          deviceId: { exact: deviceId },
        }),
      })
    )
  })

  test(`returns null when ${kind} request fails`, async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new Error())

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind }))

    const mediaStream = await result.current.requestMediaStream()

    expect(mediaStream).toBeNull()
  })

  test(`releases ${kind} media stream`, async () => {
    const mediaStreamTrack = {
      stop: vi.fn(),
    } as unknown as MediaStreamTrack

    const userMediaStream = {
      getTracks: (): MediaStreamTrack[] => [mediaStreamTrack],
    } as unknown as MediaStream

    const getUserMedia = vi.fn().mockResolvedValue(userMediaStream)

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind }))

    const mediaStream = await result.current.requestMediaStream()

    result.current.releaseMediaStream(mediaStream!)

    expect(mediaStreamTrack.stop).toHaveBeenCalled()
  })

  test(`releases ${kind} media stream when unmounted`, async () => {
    const mediaStreamTrack = {
      stop: vi.fn(),
    } as unknown as MediaStreamTrack

    const mediaStream = {
      getTracks: (): MediaStreamTrack[] => [mediaStreamTrack],
    } as unknown as MediaStream

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(mediaStream),
      },
    })

    const { result, unmount } = renderHook(() => useMedia({ kind: 'video' }))

    await result.current.requestMediaStream()

    unmount()

    expect(mediaStreamTrack.stop).toHaveBeenCalled()
  })

  test(`throws error when release ${kind} media stream not requested`, () => {
    const { result } = renderHook(() => useMedia({ kind }))

    expect(() =>
      result.current.releaseMediaStream({} as unknown as MediaStream)
    ).toThrow()
  })
})

describe('useMedia', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('requests screen media stream', async () => {
    const displayMediaStream = {
      getTracks: (): MediaStreamTrack[] => [],
    } as unknown as MediaStream

    const getDisplayMedia = vi.fn().mockResolvedValue(displayMediaStream)

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getDisplayMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind: 'screen' }))

    const mediaStream = await result.current.requestMediaStream()

    expect(mediaStream).toEqual(displayMediaStream)
  })

  test('returns null when screen request fails', async () => {
    const getDisplayMedia = vi.fn().mockRejectedValue(new Error())

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getDisplayMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind: 'screen' }))

    const mediaStream = await result.current.requestMediaStream()

    expect(mediaStream).toBeNull()
  })

  test('releases screen media stream', async () => {
    const mediaStreamTrack = {
      stop: vi.fn(),
    } as unknown as MediaStreamTrack

    const displayMediaStream = {
      getTracks: (): MediaStreamTrack[] => [mediaStreamTrack],
    } as unknown as MediaStream

    const getDisplayMedia = vi.fn().mockResolvedValue(displayMediaStream)

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getDisplayMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind: 'screen' }))

    const mediaStream = await result.current.requestMediaStream()

    result.current.releaseMediaStream(mediaStream!)

    expect(mediaStreamTrack.stop).toHaveBeenCalled()
  })

  test('releases screen media stream when unmounted', async () => {
    const mediaStreamTrack = {
      stop: vi.fn(),
    } as unknown as MediaStreamTrack

    const mediaStream = {
      getTracks: (): MediaStreamTrack[] => [mediaStreamTrack],
    } as unknown as MediaStream

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getDisplayMedia: vi.fn().mockResolvedValue(mediaStream),
      },
    })

    const { result, unmount } = renderHook(() => useMedia({ kind: 'screen' }))

    await result.current.requestMediaStream()

    unmount()

    expect(mediaStreamTrack.stop).toHaveBeenCalled()
  })

  test('throws error when release screen media stream not requested', () => {
    const { result } = renderHook(() => useMedia({ kind: 'screen' }))

    expect(() =>
      result.current.releaseMediaStream({} as unknown as MediaStream)
    ).toThrow()
  })

  test('request audio media with enhancements', async () => {
    const audioMediaStream = {
      getTracks: (): MediaStreamTrack[] => [],
    } as unknown as MediaStream

    const getUserMedia = vi.fn().mockResolvedValue(audioMediaStream)

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia,
      },
    })

    const { result } = renderHook(() => useMedia({ kind: 'audio' }))

    const mediaStream = await result.current.requestMediaStream()

    expect(mediaStream).toEqual(audioMediaStream)

    expect(getUserMedia).toHaveBeenCalledWith({
      audio: expect.objectContaining({
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      }),
    })
  })
})
