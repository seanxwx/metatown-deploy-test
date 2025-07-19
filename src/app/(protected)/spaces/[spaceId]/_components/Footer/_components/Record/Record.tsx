import { FC, useEffect, useState } from 'react'
import IconButton from '@/components/IconButton'
import createSegmentRecorder from './_utils/createSegmentRecorder'

interface Props {
  stream: MediaStream
}

const Record: FC<Props> = ({ stream }) => {
  const [recorder, setRecorder] =
    useState<ReturnType<typeof createSegmentRecorder>>(null)

  useEffect(() => {
    if (!recorder) {
      return
    }

    return (): void => {
      recorder.stop()
    }
  }, [recorder])

  const handleStart = async (): Promise<void> => {
    const segmentRecorder = createSegmentRecorder(stream)

    if (!segmentRecorder) {
      return
    }

    try {
      await segmentRecorder.start(30)

      setRecorder(segmentRecorder)
    } catch {
      return
    }
  }

  const handleClick = async (): Promise<void> => {
    if (!recorder) {
      await handleStart()

      return
    }

    recorder.stop()

    setRecorder(null)
  }

  return (
    <IconButton
      variant={recorder ? 'success' : 'danger'}
      onClick={() => void handleClick()}
      icon="file-video-2"
      label={recorder ? 'Stop Recording' : 'Start Recording'}
      tooltip={{ position: 'top' }}
    />
  )
}

export default Record
