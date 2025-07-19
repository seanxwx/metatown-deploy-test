import getScreenProducer from './getScreenProducer'

describe('getScreenProducer', () => {
  test('returns screen producer for active participant', () => {
    const user = { id: 'USER_ID' }

    const users = [user.id, 'USER_ID_2']

    const screenProducer = { userId: user.id, state: 'ACTIVE', kind: 'screen' }

    const producers = [
      screenProducer,
      { userId: user.id, state: 'INACTIVE', kind: 'video' },
      { userId: 'user3', state: 'ACTIVE', kind: 'screen' },
    ]

    const result = getScreenProducer(users, producers)
    expect(result).toEqual(screenProducer)
  })

  test('returns undefined if producers is null', () => {
    const user = { id: 'USER_ID' }

    const users = [user.id, 'USER_ID_2']

    const result = getScreenProducer(users, null)
    expect(result).toBeUndefined()
  })

  test('returns undefined if no screen producer found', () => {
    const user = { id: 'USER_ID' }

    const users = [user.id, 'USER_ID_2']

    const producers = [
      { userId: user.id, state: 'INACTIVE', kind: 'video' },
      { userId: 'user3', state: 'ACTIVE', kind: 'video' },
    ]

    const result = getScreenProducer(users, producers)
    expect(result).toBeUndefined()
  })

  test('returns undefined if participant does not found', () => {
    const producers = [
      { userId: 'user1', state: 'ACTIVE', kind: 'screen' },
      { userId: 'user2', state: 'INACTIVE', kind: 'video' },
    ]

    const result = getScreenProducer([], producers)
    expect(result).toBeUndefined()
  })

  test('returns undefined if no active screen producer found', () => {
    const user = { id: 'USER_ID' }

    const users = [user.id, 'USER_ID_2']

    const producers = [
      { userId: user.id, state: 'INACTIVE', kind: 'screen' },
      { userId: 'user3', state: 'ACTIVE', kind: 'video' },
    ]

    const result = getScreenProducer(users, producers)
    expect(result).toBeUndefined()
  })
})
