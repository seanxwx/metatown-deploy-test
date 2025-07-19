import { renderHook, waitFor } from '@testing-library/react'
import useAvailableDevices from './useAvailableDevices'

describe('useAvailableDevices', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  test('filters video devices by kind value and returns', async () => {
    const kind = 'videoinput'

    const audioDevice: MediaDeviceInfo = {
      deviceId: 'DEVICE_ID_1',
      kind: 'audioinput',
      label: 'MICROPHONE',
      groupId: 'GROUP_1',
    } as MediaDeviceInfo

    const videoDevice: MediaDeviceInfo = {
      deviceId: 'DEVICE_ID_2',
      kind,
      label: 'CAMERA',
      groupId: 'GROUP_2',
    } as MediaDeviceInfo

    const devices: MediaDeviceInfo[] = [
      audioDevice,
      videoDevice,
    ] as MediaDeviceInfo[]

    vi.stubGlobal('navigator', {
      mediaDevices: {
        enumerateDevices: vi.fn().mockResolvedValue(devices),
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [],
        }),
      },
    })

    const { result } = renderHook(() => useAvailableDevices(kind))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.devices).toEqual([])

    await waitFor(() => expect(result.current.devices).toHaveLength(1))

    expect(result.current.devices[0]).toEqual(videoDevice)
  })

  test('filters audio devices by kind value and returns', async () => {
    const kind = 'audioinput'

    const audioDevice: MediaDeviceInfo = {
      deviceId: 'DEVICE_ID_1',
      kind,
      label: 'MICROPHONE',
      groupId: 'GROUP_1',
    } as MediaDeviceInfo

    const videoDevice: MediaDeviceInfo = {
      deviceId: 'DEVICE_ID_2',
      kind: 'videoinput',
      label: 'CAMERA',
      groupId: 'GROUP_2',
    } as MediaDeviceInfo

    const devices: MediaDeviceInfo[] = [
      audioDevice,
      videoDevice,
    ] as MediaDeviceInfo[]

    vi.stubGlobal('navigator', {
      mediaDevices: {
        enumerateDevices: vi.fn().mockResolvedValue(devices),
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [],
        }),
      },
    })

    const { result } = renderHook(() => useAvailableDevices(kind))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.devices).toEqual([])

    await waitFor(() => expect(result.current.devices).toHaveLength(1))

    expect(result.current.devices[0]).toEqual(audioDevice)
  })
})
