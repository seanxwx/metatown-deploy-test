import { useState } from 'react'

interface Focused {
  userId: string
  kind: 'participant' | 'screen'
}

type isFocused = (
  userId: Focused['userId'] | undefined,
  kind: Focused['kind']
) => boolean

const useFocused = (
  users: string[],
  screen?: { userId: string; kind: 'screen' } | null
): {
  focused: Focused | null | undefined
  isTargetFocused: isFocused
  handleFocus: (value: Focused | null) => void
} => {
  const [focused, setFocused] = useState<Focused | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const onlineFocused =
    (focused?.kind === 'participant' && users.includes(focused.userId)) ||
    (focused?.kind === 'screen' && screen?.userId === focused.userId)
      ? focused
      : null

  const effectiveFocused = isDirty ? onlineFocused : screen

  const handleFocus = (value: Focused | null): void => {
    setIsDirty(true)

    if (!focused) {
      setFocused(value)

      return
    }

    setFocused(null)
    requestAnimationFrame(() => {
      setFocused(value)
    })
  }

  const isTargetFocused: isFocused = (userId, kind) =>
    !!effectiveFocused &&
    effectiveFocused.userId === userId &&
    effectiveFocused.kind === kind

  return {
    focused: effectiveFocused,
    isTargetFocused,
    handleFocus,
  }
}

export default useFocused
