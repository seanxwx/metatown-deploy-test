import { useEffect, useState } from 'react'
import clamp from '@/utils/clamp'

export const FFT_SIZE = 256

const useVolume = (audioStream: MediaStream | null): number => {
  const [volume, setVolume] = useState<number>(0)

  useEffect(() => {
    if (!audioStream) {
      return
    }

    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(audioStream)
    const analyser = audioCtx.createAnalyser()

    analyser.fftSize = FFT_SIZE
    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)

    source.connect(analyser)

    const getVolume = (): number => {
      analyser.getByteTimeDomainData(dataArray)

      const rms = Math.sqrt(
        dataArray.reduce((sum, data) => {
          const amplitude = (data - 128) / 128

          return sum + amplitude * amplitude
        }, 0) / dataArray.length
      )

      if (rms < 0.001) {
        return 0
      }

      const dbfs = 20 * Math.log10(rms)
      const volumePercent = clamp(((dbfs + 60) / 60) * 100, 0, 100)

      return volumePercent
    }

    let frame: number

    const update = (): void => {
      setVolume(getVolume())
      frame = requestAnimationFrame(update)
    }

    update()

    return (): void => {
      source.disconnect()
      analyser.disconnect()
      void audioCtx.close()
      cancelAnimationFrame(frame)
    }
  }, [audioStream])

  return volume
}

export default useVolume
