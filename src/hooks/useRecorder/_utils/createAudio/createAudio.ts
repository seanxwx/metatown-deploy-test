const createAudio = (): {
  stream: MediaStream
  addTrack: (track: MediaStreamTrack) => void
  removeTrack: (track: MediaStreamTrack) => void
  cleanup: () => void
} => {
  const audioContext = new AudioContext()
  const streamDestination = audioContext.createMediaStreamDestination()

  const sourceNode = new Map<MediaStreamTrack, MediaStreamAudioSourceNode>()

  const oscillator = audioContext.createOscillator()
  oscillator.frequency.setValueAtTime(0, audioContext.currentTime)
  oscillator.connect(streamDestination)
  oscillator.start()

  const addTrack = (track: MediaStreamTrack): void => {
    if (track.kind !== 'audio' || sourceNode.has(track)) {
      return
    }

    const streamSource = audioContext.createMediaStreamSource(
      new MediaStream([track])
    )

    streamSource.connect(streamDestination)
    sourceNode.set(track, streamSource)
  }

  const removeTrack = (track: MediaStreamTrack): void => {
    if (track.kind !== 'audio') {
      return
    }

    const streamSource = sourceNode.get(track)

    if (!streamSource) {
      return
    }

    streamSource.disconnect(streamDestination)
    sourceNode.delete(track)
  }

  const cleanup = (): void => {
    oscillator.stop()
    void audioContext.close()
  }

  return {
    stream: streamDestination.stream,
    addTrack,
    removeTrack,
    cleanup,
  }
}

export default createAudio
