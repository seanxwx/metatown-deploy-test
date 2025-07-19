import { useEffect, useRef } from 'react'

interface CameraOptions {
  camera?: MediaTrackConstraints
  kind: 'video'
}

interface MicOptions {
  mic?: MediaTrackConstraints
  kind: 'audio'
}

interface DisplayOptions {
  display?: MediaTrackConstraints
  kind: 'screen'
}

const isCameraOptions = (
  options: CameraOptions | MicOptions | DisplayOptions
): options is CameraOptions => options.kind === 'video'

const isMicOptions = (
  options: CameraOptions | MicOptions | DisplayOptions
): options is MicOptions => options.kind === 'audio'

const isDisplayOptions = (
  options: CameraOptions | MicOptions | DisplayOptions
): options is DisplayOptions => options.kind === 'screen'

export type Options = CameraOptions | MicOptions | DisplayOptions

const useMedia = (
  options: Options
): {
  requestMediaStream: (deviceId?: string | null) => Promise<MediaStream | null>
  releaseMediaStream: (mediaStream: MediaStream) => void
} => {
  const mediaStreamRef = useRef<MediaStream | null>(null)

  const requestMediaStream = async (
    deviceId?: string | null
  ): Promise<MediaStream | null> => {
    const constraints: MediaStreamConstraints = {}

    if (isCameraOptions(options)) {
      constraints.video = options.camera ?? {}
      constraints.video.deviceId = deviceId ? { exact: deviceId } : undefined
    }

    if (isMicOptions(options)) {
      constraints.audio = options.mic ?? {}
      constraints.audio.deviceId = deviceId ? { exact: deviceId } : undefined
      constraints.audio.autoGainControl = true
      constraints.audio.echoCancellation = true
      constraints.audio.noiseSuppression = true
    }

    const displayOptions: DisplayMediaStreamOptions = {}
    if (isDisplayOptions(options)) {
      displayOptions.video = options.display ?? {}
    }

    try {
      const mediaStream = displayOptions.video
        ? await window.navigator.mediaDevices.getDisplayMedia(displayOptions)
        : await window.navigator.mediaDevices.getUserMedia(constraints)

      mediaStreamRef.current = mediaStream

      return mediaStream
    } catch {
      mediaStreamRef.current = null

      return null
    }
  }

  const releaseMediaStream = (mediaStream: MediaStream): void => {
    if (mediaStream !== mediaStreamRef.current) {
      throw new Error()
    }

    mediaStream.getTracks().forEach((track) => track.stop())
  }

  useEffect(
    () => (): void => {
      if (!mediaStreamRef.current) {
        return
      }

      releaseMediaStream(mediaStreamRef.current)
    },
    []
  )

  return { requestMediaStream, releaseMediaStream }
}

export default useMedia
