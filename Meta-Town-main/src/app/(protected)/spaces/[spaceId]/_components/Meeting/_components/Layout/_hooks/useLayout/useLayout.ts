import { RefObject, useEffect, useState } from 'react'
import calculateGridLayout from './_utils/calculateGridLayout'
import calculateSingleAxisLayout from './_utils/calculateSingleAxisLayout'

interface Result {
  columns: number
  rows: number
}

const useLayout = (
  ref: RefObject<HTMLElement | null>,
  count: number,
  singleAxis?: 'row' | 'column'
): Result => {
  const [layout, setLayout] = useState<Result>({
    columns: 0,
    rows: 0,
  })

  useEffect(() => {
    const target = ref.current

    const handleCalculate = (): void => {
      if (!target) {
        return
      }

      target.style.height = '100%'

      const width = target.clientWidth
      const height = target.clientHeight

      const { columns, rows, style } = singleAxis
        ? calculateSingleAxisLayout(width, height, count, singleAxis)
        : calculateGridLayout(width, height, count)

      setLayout({ columns, rows })

      target.style.gridTemplateColumns = style.gridTemplateColumns
      target.style.gridTemplateRows = style.gridTemplateRows
      target.style.gap = style.gap

      target.style.removeProperty('height')
    }

    handleCalculate()

    if (!target?.parentElement) {
      return
    }

    const observer = new ResizeObserver(handleCalculate)
    observer.observe(target.parentElement)

    return (): void => {
      observer.disconnect()
    }
  }, [ref, count, singleAxis])

  return layout
}

export default useLayout
