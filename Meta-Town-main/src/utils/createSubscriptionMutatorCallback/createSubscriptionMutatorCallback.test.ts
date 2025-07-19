import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import createSubscriptionMutatorCallback from './createSubscriptionMutatorCallback'

describe('createSubscriptionMutatorCallback', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns subscriptionMutator callback function', () => {
    const id = 'ID'

    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'UPDATE',
      new: { id, x: 1, y: 1 },
      old: {},
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      (row) => ({ id: row.id, x: row.x, y: row.y })
    )

    expect(subscriptionMutator).toBeInstanceOf(Function)
  })

  test('does not mutate data for deletion when data does not exist', () => {
    const id = 'ID'

    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'DELETE',
      new: {},
      old: { id, x: 1, y: 1 },
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const transformData = vi
      .fn()
      .mockImplementation((row: { id: string; x: number; y: number }) => ({
        id: row.id,
        x: row.x,
        y: row.y,
      }))

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      transformData
    )

    const data = undefined
    const newData = subscriptionMutator(data)

    expect(transformData).not.toBeCalled()
    expect(newData).toBeUndefined()
  })

  test('mutates data for deletion', () => {
    const id = 'ID'

    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'DELETE',
      new: {},
      old: { id, x: 1, y: 1 },
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const transformData = vi
      .fn()
      .mockImplementation((row: { id: string; x: number; y: number }) => ({
        id: row.id,
        x: row.x,
        y: row.y,
      }))

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      transformData
    )

    const data = [{ id, x: 1, y: 1 }]
    const newData = subscriptionMutator(data)

    expect(transformData).not.toBeCalled()
    expect(newData).toEqual([])
  })

  test('mutates data for insertion', () => {
    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'INSERT',
      new: {
        id: '1',
        x: 1,
        y: 1,
      },
      old: {},
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const transformData = vi
      .fn()
      .mockImplementation((row: { id: string; x: number; y: number }) => ({
        id: row.id,
        x: row.x,
        y: row.y,
      }))

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      transformData
    )

    const newData = subscriptionMutator([])

    expect(transformData).toHaveBeenCalledWith(payload.new)
    expect(newData).toEqual([
      {
        id: payload.new.id,
        x: payload.new.x,
        y: payload.new.y,
      },
    ])
  })

  test('mutates data for insertion even if data does not exist', () => {
    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'INSERT',
      new: { id: '1', x: 1, y: 1 },
      old: {},
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const transformData = vi
      .fn()
      .mockImplementation((row: { id: string; x: number; y: number }) => ({
        id: row.id,
        x: row.x,
        y: row.y,
      }))

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      transformData
    )

    const data = undefined
    const newData = subscriptionMutator(data)

    expect(transformData).toHaveBeenCalledWith(payload.new)
    expect(newData).toEqual([
      {
        id: payload.new.id,
        x: payload.new.x,
        y: payload.new.y,
      },
    ])
  })

  test('does not mutate data for update when data does not exist', () => {
    const id = 'ID'

    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'UPDATE',
      new: {
        id,
        x: 2,
        y: 2,
      },
      old: {},
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const transformData = vi
      .fn()
      .mockImplementation((row: { id: string; x: number; y: number }) => ({
        id: row.id,
        x: row.x,
        y: row.y,
      }))

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      transformData
    )

    const data = undefined
    const newData = subscriptionMutator(data)

    expect(transformData).toHaveBeenCalledWith(payload.new)
    expect(newData).toBeUndefined()
  })

  test('updates the specific entry to newest, keep other entries unchanged', () => {
    const id = '1'

    const payload: RealtimePostgresChangesPayload<{
      id: string
      x: number
      y: number
    }> = {
      eventType: 'UPDATE',
      new: {
        id,
        x: 2,
        y: 2,
      },
      old: {},
      schema: 'public',
      table: 'test',
      commit_timestamp: '2025-03-31T00:00:00Z',
      errors: [],
    }

    const transformData = vi
      .fn()
      .mockImplementation((row: { id: string; x: number; y: number }) => ({
        id: row.id,
        x: row.x,
        y: row.y,
      }))

    const subscriptionMutator = createSubscriptionMutatorCallback(
      payload,
      transformData
    )

    const data = [
      {
        id,
        x: 1,
        y: 1,
      },
      {
        id: '2',
        x: 1,
        y: 1,
      },
    ]
    const newData = subscriptionMutator(data)

    expect(transformData).toHaveBeenCalledWith(payload.new)
    expect(newData).toEqual([
      {
        id,
        x: payload.new.x,
        y: payload.new.y,
      },
      {
        id: '2',
        x: 1,
        y: 1,
      },
    ])
  })
})
