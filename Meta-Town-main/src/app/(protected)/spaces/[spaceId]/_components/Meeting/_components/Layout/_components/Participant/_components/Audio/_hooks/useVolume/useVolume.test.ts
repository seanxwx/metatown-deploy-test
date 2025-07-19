import { act, renderHook } from '@testing-library/react'
import useVolume, { FFT_SIZE } from './useVolume'

describe('useVolume', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  test('returns calculated volume percentage for provided audio in realtime', async () => {
    let audioData = 256

    const analyser = {
      fftSize: 0,
      getByteTimeDomainData: vi
        .fn()
        .mockImplementation((dataArray: Uint8Array) => {
          dataArray.fill(audioData)
        }),
      disconnect: vi.fn(),
    }

    const source = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }

    const audioCtx = {
      createMediaStreamSource: vi.fn().mockReturnValue(source),
      createAnalyser: vi.fn().mockReturnValue(analyser),
      close: vi.fn(),
    } as unknown as AudioContext

    const AudioContext = vi.fn().mockReturnValue(audioCtx)
    vi.stubGlobal('AudioContext', AudioContext)

    const dataArray = new Uint8Array([100])
    vi.stubGlobal(
      'Uint8Array',
      vi.fn(() => dataArray)
    )

    const stream = {} as MediaStream

    vi.useFakeTimers()

    const { result } = renderHook(() => useVolume(stream))

    expect(audioCtx.createMediaStreamSource).toHaveBeenCalledWith(stream)
    expect(audioCtx.createAnalyser).toHaveBeenCalled()
    expect(analyser.fftSize).toBe(FFT_SIZE)

    expect(Uint8Array).toHaveBeenCalledWith(analyser.fftSize)
    expect(source.connect).toHaveBeenCalledWith(analyser)
    expect(analyser.getByteTimeDomainData).toHaveBeenCalledWith(dataArray)

    expect(result.current).toBe(100)

    audioData = 128
    await act(() => vi.advanceTimersToNextFrame())

    expect(result.current).toBe(0)

    vi.useRealTimers()
  })

  test('does not calculate volume if there is no audio provided', () => {
    const AudioContext = vi.fn().mockReturnValue({} as AudioContext)
    vi.stubGlobal('AudioContext', AudioContext)

    renderHook(() => useVolume(null))

    expect(AudioContext).not.toHaveBeenCalled()
  })

  test('cleans up audio context and animation frame on unmount', () => {
    const analyser = {
      getByteTimeDomainData: vi.fn(),
      disconnect: vi.fn(),
    }

    const source = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }

    const audioCtx = {
      createMediaStreamSource: vi.fn().mockReturnValue(source),
      createAnalyser: vi.fn().mockReturnValue(analyser),
      close: vi.fn(),
      state: 'running',
    } as unknown as AudioContext

    const AudioContext = vi.fn().mockReturnValue(audioCtx)
    vi.stubGlobal('AudioContext', AudioContext)

    const cancelAnimationFrame = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame)

    const { unmount } = renderHook(() => useVolume({} as MediaStream))

    unmount()

    expect(source.disconnect).toHaveBeenCalled()
    expect(analyser.disconnect).toHaveBeenCalled()
    expect(audioCtx.close).toHaveBeenCalled()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })
})
