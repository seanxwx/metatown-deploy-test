import { RefCallback, useCallback, useState } from 'react'

const useRegister = (): {
  register: Record<string, HTMLDivElement | null>
  ref: RefCallback<HTMLDivElement>
} => {
  const [register, setRegister] = useState<
    Record<string, HTMLDivElement | null>
  >({})

  const ref = useCallback<RefCallback<HTMLDivElement>>((element) => {
    const id = element?.dataset.id

    if (!id) {
      return
    }

    setRegister((previousRegister) => ({
      ...previousRegister,
      [id]: element,
    }))
  }, [])

  return {
    register,
    ref,
  }
}

export default useRegister
