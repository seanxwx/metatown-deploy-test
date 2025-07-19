import { useEffect, useState } from 'react'
import createVideo from './_utils/createVideo'
import createAudio from './_utils/createAudio'

interface Recorder {
  stream: MediaStream
  addTrack: (track: MediaStreamTrack) => void
  removeTrack: (track: MediaStreamTrack) => void
}

const useRecorder = (): Recorder | null => {
  const [reorder, setRecorder] = useState<Recorder | null>(null)

  useEffect(() => {
    const video = createVideo()
    const audio = createAudio()

    video.stream.addTrack(audio.stream.getAudioTracks()[0])

    const addTrack = (track: MediaStreamTrack): void => {
      video.addTrack(track)
      audio.addTrack(track)
    }

    const removeTrack = (track: MediaStreamTrack): void => {
      video.removeTrack(track)
      audio.removeTrack(track)
    }

    setRecorder({
      stream: video.stream,
      addTrack,
      removeTrack,
    })

    return (): void => {
      video.cleanup()
      audio.cleanup()
    }
  }, [])

  return reorder
}

export default useRecorder
