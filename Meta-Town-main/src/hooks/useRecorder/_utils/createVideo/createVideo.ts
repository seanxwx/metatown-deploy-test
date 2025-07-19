const createVideo = (): {
  stream: MediaStream
  addTrack: (track: MediaStreamTrack) => void
  removeTrack: (track: MediaStreamTrack) => void
  cleanup: () => void
} => {
  let frame: number

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error()
  }

  const video = document.createElement('video')
  context.font = '40px monospace'

  const render = (): void => {
    if (video.srcObject && video.readyState >= 2) {
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height)
    } else {
      if (canvas.width !== 1280 || canvas.height !== 720) {
        canvas.width = 1280
        canvas.height = 720
      }

      context.fillStyle = 'black'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = 'white'
      context.fillText(new Date().toLocaleTimeString(), 50, 100)
    }

    frame = requestAnimationFrame(render)
  }

  render()

  const addTrack = (track: MediaStreamTrack): void => {
    if (track.kind !== 'video') {
      return
    }

    video.srcObject = new MediaStream([track])

    void video.play()
  }

  const removeTrack = (track: MediaStreamTrack): void => {
    if (track.kind !== 'video') {
      return
    }

    video.srcObject = null
  }

  const cleanup = (): void => {
    cancelAnimationFrame(frame)
  }

  return {
    stream: canvas.captureStream(30),
    addTrack,
    removeTrack,
    cleanup,
  }
}

export default createVideo
