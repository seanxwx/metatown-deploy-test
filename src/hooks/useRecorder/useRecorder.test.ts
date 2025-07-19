import { renderHook } from '@testing-library/react'
import createAudio from './_utils/createAudio'
import createVideo from './_utils/createVideo'
import useRecorder from './useRecorder'

vi.mock('./_utils/createVideo')
const createVideoMock = vi.mocked(createVideo)

vi.mock('./_utils/createAudio')
const createAudioMock = vi.mocked(createAudio)

describe('useRecorder', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns recorder with addTrack, and removeTrack', () => {
    const audio = {
      stream: {
        getAudioTracks: vi.fn().mockReturnValue([{}]),
      } as unknown as MediaStream,
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
      cleanup: vi.fn(),
    }

    createAudioMock.mockReturnValue(audio)

    const video = {
      stream: {
        addTrack: vi.fn(),
      } as unknown as MediaStream,
      addTrack: vi.fn(),
      removeTrack: vi.fn(),
      cleanup: vi.fn(),
    }

    createVideoMock.mockReturnValue(video)

    const { result, unmount } = renderHook(() => useRecorder())

    expect(video.stream.addTrack).toHaveBeenCalledWith(
      audio.stream.getAudioTracks()[0]
    )

    expect(result.current!.addTrack).toBeInstanceOf(Function)
    expect(result.current!.removeTrack).toBeInstanceOf(Function)

    const track = {} as MediaStreamTrack

    result.current!.addTrack(track)

    expect(video.addTrack).toHaveBeenCalledWith(track)
    expect(audio.addTrack).toHaveBeenCalledWith(track)

    result.current!.removeTrack(track)

    expect(video.removeTrack).toHaveBeenCalledWith(track)
    expect(audio.removeTrack).toHaveBeenCalledWith(track)

    unmount()

    expect(video.cleanup).toHaveBeenCalled()
    expect(audio.cleanup).toHaveBeenCalled()
  })
})
