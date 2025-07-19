import createSegmentRecorder, { MIME_TYPE } from './createSegmentRecorder'

describe('createMediaRecorder', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('records stream and writes to file', async () => {
    vi.useFakeTimers()

    const mediaRecorder = {
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as MediaRecorder

    const MediaRecorder = vi
      .fn()
      .mockReturnValue(mediaRecorder) as unknown as typeof window.MediaRecorder
    MediaRecorder.isTypeSupported = vi.fn().mockReturnValue(true)
    vi.stubGlobal('MediaRecorder', MediaRecorder)

    const writableStream = {
      write: vi.fn(),
      close: vi.fn(),
    } as unknown as FileSystemWritableFileStream

    const fileHandle = {
      createWritable: vi.fn().mockResolvedValue(writableStream),
    }

    const directoryHandle = {
      getFileHandle: vi.fn().mockResolvedValue(fileHandle),
    }

    const showDirectoryPicker = vi.fn().mockResolvedValue(directoryHandle)
    vi.stubGlobal('showDirectoryPicker', showDirectoryPicker)

    const stream = {} as MediaStream
    const result = createSegmentRecorder(stream)

    expect(MediaRecorder.isTypeSupported).toHaveBeenCalledWith(MIME_TYPE)

    const event = {
      data: {
        size: 1,
      },
    }

    expect(result).toEqual({
      start: expect.any(Function),
      stop: expect.any(Function),
    })

    await result!.start(10)

    expect(showDirectoryPicker).toHaveBeenCalledWith({
      mode: 'readwrite',
    })

    expect(MediaRecorder).toHaveBeenCalledTimes(1)
    expect(MediaRecorder).toHaveBeenCalledWith(stream, {
      mimeType: MIME_TYPE,
    })

    expect(directoryHandle.getFileHandle).toHaveBeenCalledWith(
      `meeting-${Date.now()}.webm`,
      { create: true }
    )

    await vi.waitFor(() => expect(mediaRecorder.start).toHaveBeenCalled())

    expect(fileHandle.createWritable).toHaveBeenCalled()

    await mediaRecorder.ondataavailable!(event as unknown as BlobEvent)
    expect(writableStream.write).toHaveBeenCalledWith(event.data)

    result!.stop()

    expect(mediaRecorder.stop).toHaveBeenCalled()
    await mediaRecorder.onstop!({} as Event)
    expect(writableStream.close).toHaveBeenCalled()

    expect(MediaRecorder).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test('records stream in segments', async () => {
    vi.useFakeTimers()

    const mediaRecorder = {
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as MediaRecorder

    const MediaRecorder = vi
      .fn()
      .mockReturnValue(mediaRecorder) as unknown as typeof window.MediaRecorder
    MediaRecorder.isTypeSupported = vi.fn().mockReturnValue(true)
    vi.stubGlobal('MediaRecorder', MediaRecorder)

    const writableStream = {
      write: vi.fn(),
      close: vi.fn(),
    } as unknown as FileSystemWritableFileStream

    const fileHandle = {
      createWritable: vi.fn().mockResolvedValue(writableStream),
    }

    const directoryHandle = {
      getFileHandle: vi.fn().mockResolvedValue(fileHandle),
    }

    const showDirectoryPicker = vi.fn().mockResolvedValue(directoryHandle)
    vi.stubGlobal('showDirectoryPicker', showDirectoryPicker)

    const stream = {} as MediaStream
    const result = createSegmentRecorder(stream)

    const durationSlice = 10
    await result!.start(durationSlice)

    expect(showDirectoryPicker).toHaveBeenCalledTimes(1)

    expect(MediaRecorder).toHaveBeenCalledTimes(1)
    expect(directoryHandle.getFileHandle).toHaveBeenCalledTimes(1)
    expect(fileHandle.createWritable).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(mediaRecorder.start).toHaveBeenCalledTimes(1))

    vi.advanceTimersByTime(durationSlice * 60 * 1000)

    expect(mediaRecorder.stop).toHaveBeenCalledTimes(1)
    await mediaRecorder.onstop!({} as Event)

    expect(showDirectoryPicker).toHaveBeenCalledTimes(1)

    expect(MediaRecorder).toHaveBeenCalledTimes(2)
    expect(directoryHandle.getFileHandle).toHaveBeenCalledTimes(2)
    expect(fileHandle.createWritable).toHaveBeenCalledTimes(2)
    await vi.waitFor(() => expect(mediaRecorder.start).toHaveBeenCalledTimes(2))

    result!.stop()

    expect(mediaRecorder.stop).toHaveBeenCalledTimes(2)
    await mediaRecorder.onstop!({} as Event)

    expect(showDirectoryPicker).toHaveBeenCalledTimes(1)

    expect(MediaRecorder).toHaveBeenCalledTimes(2)
    expect(directoryHandle.getFileHandle).toHaveBeenCalledTimes(2)
    expect(fileHandle.createWritable).toHaveBeenCalledTimes(2)
    await vi.waitFor(() => expect(mediaRecorder.start).toHaveBeenCalledTimes(2))
  })

  test('does not return recorder if showDirectoryPicker is unavailable', () => {
    const result = createSegmentRecorder({} as MediaStream)

    vi.stubGlobal('showDirectoryPicker', undefined)

    expect(result).toBeNull()
  })

  test('does not return recorder if mimeType is unsupported', () => {
    vi.stubGlobal('MediaStream', vi.fn())
    vi.stubGlobal('showDirectoryPicker', vi.fn())

    const MediaRecorder = vi.fn() as unknown as typeof window.MediaRecorder
    MediaRecorder.isTypeSupported = vi.fn().mockReturnValue(false)
    vi.stubGlobal('MediaRecorder', MediaRecorder)

    const result = createSegmentRecorder({} as MediaStream)

    expect(result).toBeNull()
  })
})
