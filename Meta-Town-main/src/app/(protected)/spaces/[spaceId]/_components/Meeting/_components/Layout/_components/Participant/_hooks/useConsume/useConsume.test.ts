import { renderHook, waitFor } from '@testing-library/react'
import { Consumer } from 'mediasoup-client/types'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useConsume from './useConsume'

describe('useConsume', () => {
  test('returns null when producerId is null', () => {
    const mediasoupClient = {
      consume: vi.fn(),
    } as unknown as MediasoupClient

    const { result } = renderHook(() => useConsume(mediasoupClient, null))
    expect(result.current).toBeNull()
  })

  test('returns null if can not consume', () => {
    const producerId = 'PRODUCER_ID'

    const consume = vi.fn().mockResolvedValue(null)

    const mediasoupClient = {
      consume,
    } as unknown as MediasoupClient

    const { result } = renderHook(() => useConsume(mediasoupClient, producerId))

    expect(consume).toHaveBeenCalledWith(producerId)

    expect(result.current).toBeNull()
  })

  test('returns MediaStream with track when consumer is created', async () => {
    const producerId = 'PRODUCER_ID'

    const consumer = { track: {}, close: vi.fn() }
    const consume = vi.fn().mockResolvedValue(consumer as unknown as Consumer)

    const mediaStream = { addTrack: vi.fn() }

    const MediaStream = vi
      .fn()
      .mockReturnValue(mediaStream as unknown as MediaStream)

    vi.stubGlobal('MediaStream', MediaStream)

    const mediasoupClient = {
      consume,
    } as unknown as MediasoupClient

    const { result, unmount } = renderHook(() =>
      useConsume(mediasoupClient, producerId)
    )

    await waitFor(() => expect(result.current).toEqual(mediaStream))
    expect(mediaStream.addTrack).toHaveBeenCalledWith(consumer.track)

    unmount()

    expect(consumer.close).toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
