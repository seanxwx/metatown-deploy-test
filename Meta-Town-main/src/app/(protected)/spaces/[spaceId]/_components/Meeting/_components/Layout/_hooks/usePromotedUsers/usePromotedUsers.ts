import { debounce } from 'lodash'
import { useMemo, useState } from 'react'

const usePromotedUsers = <T extends string>(
  users: T[],
  length: number
): { promotedUsers: T[]; handleSpeak: (userId: T) => void } => {
  const [speakers, setSpeakers] = useState<Partial<Record<T, number>>>({})

  const handleDebounceSpeak = useMemo(() => debounce(setSpeakers, 500), [])

  const promotedUsers = users
    .sort((a, b) => (speakers[b] ?? 0) - (speakers[a] ?? 0))
    .slice(0, length)

  const handleSpeak = (userId: T): void => {
    const now = Date.now()

    if (promotedUsers.includes(userId)) {
      return
    }

    handleDebounceSpeak((previousSpeakers) => ({
      ...previousSpeakers,
      [userId]: now,
    }))
  }

  return {
    promotedUsers,
    handleSpeak,
  }
}

export default usePromotedUsers
