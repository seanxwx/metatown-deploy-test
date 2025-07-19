import { FC, useEffect, useState } from 'react'
import IconButton from '@/components/IconButton'
import useStageConfig from '@/hooks/useStageConfig'

interface Props {
  spaceId: string
}

const CopyInviteLink: FC<Props> = ({ spaceId }) => {
  const { data: stageConfig } = useStageConfig(spaceId)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return (): void => {
      clearTimeout(timeout)
    }
  }, [copied])

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(
      `${window.location.host}/spaces/${spaceId}/join`
    )
    setCopied(true)
  }

  const label = stageConfig
    ? 'Copy invite link'
    : 'Set up your Space before sharing the invite'

  return (
    <IconButton
      size="small"
      variant="naked"
      icon="link"
      disabled={!stageConfig}
      label={copied ? 'Copied' : label}
      tooltip={{ position: 'bottom-left' }}
      onClick={() => void handleClick()}
      onMouseLeave={() => setCopied(false)}
    />
  )
}

export default CopyInviteLink
