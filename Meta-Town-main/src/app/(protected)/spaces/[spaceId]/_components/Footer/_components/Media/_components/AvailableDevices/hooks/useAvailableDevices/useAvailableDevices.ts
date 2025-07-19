import { useState, useEffect } from 'react'

interface AvailableDevices {
  devices: MediaDeviceInfo[]
  isLoading: boolean
}

const useAvailableDevices = (kind: MediaDeviceKind): AvailableDevices => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getAvailableDevices = async (): Promise<void> => {
      setIsLoading(true)

      const constraints: MediaStreamConstraints = {}
      if (kind === 'videoinput') {
        constraints.video = true
      }
      if (kind === 'audioinput') {
        constraints.audio = true
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices()

      const filteredDevices = allDevices.filter(
        (device) => device.kind === kind
      )

      setDevices(filteredDevices)
      setIsLoading(false)
    }

    void getAvailableDevices()
  }, [kind])

  return { devices, isLoading }
}

export default useAvailableDevices
