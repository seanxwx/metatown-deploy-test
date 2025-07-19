import { CSSProperties, RefObject, useEffect, useRef, useState } from 'react'

const useDrag = (): {
  targetRef: RefObject<HTMLDivElement | null>
  handleRef: RefObject<HTMLDivElement | null>
  style: CSSProperties
  reset: () => void
} => {
  const targetRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  const [style, setStyle] = useState<CSSProperties>({})

  useEffect(() => {
    let isDragging = false
    let offset = { x: 0, y: 0 }

    const handleMouseDown = (event: MouseEvent): void => {
      const handle = handleRef.current ?? targetRef.current

      if (
        !(event.target instanceof HTMLElement) ||
        !handle?.contains(event.target)
      ) {
        return
      }

      const target = targetRef.current

      if (!target?.parentElement) {
        return
      }

      isDragging = true

      const rect = target.parentElement.getBoundingClientRect()

      offset = {
        x: event.clientX - rect.left - target.offsetLeft,
        y: event.clientY - rect.top - target.offsetTop,
      }

      event.preventDefault()
    }

    const handleMouseMove = (event: MouseEvent): void => {
      const target = targetRef.current

      if (!target?.parentElement || !isDragging) {
        return
      }

      const rect = target.parentElement.getBoundingClientRect()

      setStyle({
        left: `${event.clientX - rect.left - offset.x}px`,
        top: `${event.clientY - rect.top - offset.y}px`,
      })
    }

    const handleMouseUp = (): void => {
      isDragging = false
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return (): void => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const reset = (): void => {
    setStyle({})
  }

  return { targetRef, handleRef, style, reset }
}

export default useDrag
