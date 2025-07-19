import { MutatorCallback } from 'swr'
import createPayloadHandler from './createPayloadHandler'

describe('createPayloadHandler', () => {
  test('returns a function that handles new payloads', () => {
    const payload = { id: '1', name: 'Test' }
    const previousData = [{ id: '2', name: 'Previous' }]

    let newData

    const next = vi
      .fn()
      .mockImplementation((_, mutatorCallback: MutatorCallback) => {
        newData = mutatorCallback(previousData)
      })

    const handler = createPayloadHandler({ next })

    handler({ payload })

    expect(next).toHaveBeenCalledWith(null, expect.any(Function))

    expect(newData).toEqual([...previousData, payload])
  })

  test('returns a function that handles payloads when previous data is null', () => {
    const payload = { id: '1', name: 'Test' }

    let newData

    const next = vi
      .fn()
      .mockImplementation((_, mutatorCallback: MutatorCallback) => {
        newData = mutatorCallback()
      })

    const handler = createPayloadHandler({ next })

    handler({ payload })

    expect(next).toHaveBeenCalledWith(null, expect.any(Function))

    expect(newData).toEqual([payload])
  })

  test('returns a function that update previous data', () => {
    const payload = { id: '1', name: 'Updated' }

    const previousData = [
      { id: '1', name: 'Previous' },
      { id: '2', name: 'Other' },
    ]

    let newData

    const next = vi
      .fn()
      .mockImplementation((_, mutatorCallback: MutatorCallback) => {
        newData = mutatorCallback(previousData)
      })

    const handler = createPayloadHandler({ next })

    handler({ payload })

    expect(next).toHaveBeenCalledWith(null, expect.any(Function))

    expect(newData).toEqual([{ id: '2', name: 'Other' }, payload])
  })
})
