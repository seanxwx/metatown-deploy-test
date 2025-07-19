export const MIME_TYPE = 'video/webm; codecs=vp9'

interface Recorder {
  start: (duration: number) => Promise<void>
  stop: () => void
}

const createSegmentRecorder = (stream: MediaStream): Recorder | null => {
  if (!('showDirectoryPicker' in window)) {
    return null
  }

  if (!MediaRecorder.isTypeSupported(MIME_TYPE)) {
    return null
  }

  let mediaRecorder: MediaRecorder | null = null
  let shouldContinue = true

  const runSegment = async (
    directoryHandle: FileSystemDirectoryHandle,
    durationSlice: number
  ): Promise<void> => {
    const recorder = new MediaRecorder(stream, {
      mimeType: MIME_TYPE,
    })

    const fileHandle = await directoryHandle.getFileHandle(
      `meeting-${Date.now()}.webm`,
      { create: true }
    )
    const writeStream = await fileHandle.createWritable()

    recorder.start()

    const perSegment = setTimeout(
      () => {
        recorder.stop()
      },
      durationSlice * 60 * 1000
    )

    recorder.ondataavailable = async (event: BlobEvent): Promise<void> => {
      await writeStream.write(event.data)
    }

    recorder.onstop = async (): Promise<void> => {
      await writeStream.close()

      clearTimeout(perSegment)

      if (!shouldContinue) {
        return
      }

      void runSegment(directoryHandle, durationSlice)
    }

    mediaRecorder = recorder
  }

  const start = async (durationSlice: number): Promise<void> => {
    const directoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
    })

    void runSegment(directoryHandle, durationSlice)
  }

  const stop = (): void => {
    shouldContinue = false

    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder = null
    }
  }

  return { start, stop }
}

export default createSegmentRecorder
