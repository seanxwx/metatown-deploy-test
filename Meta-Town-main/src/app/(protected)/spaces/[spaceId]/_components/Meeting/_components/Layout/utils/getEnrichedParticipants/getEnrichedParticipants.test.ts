import getEnrichedParticipants from './getEnrichedParticipants'

describe('getEnrichedParticipants', () => {
  test('returns participants with their producers', () => {
    const users = ['USER_ID_1', 'USER_ID_2']

    const producers = [
      { userId: 'USER_ID_1', state: 'ACTIVE', kind: 'video' },
      { userId: 'USER_ID_1', state: 'INACTIVE', kind: 'screen' },
      { userId: 'USER_ID_2', state: 'ACTIVE', kind: 'audio' },
    ]

    const result = getEnrichedParticipants(users, producers)

    expect(result).toEqual([
      {
        id: 'USER_ID_1',
        producers: [
          { userId: 'USER_ID_1', state: 'ACTIVE', kind: 'video' },
          { userId: 'USER_ID_1', state: 'INACTIVE', kind: 'screen' },
        ],
      },
      {
        id: 'USER_ID_2',
        producers: [{ userId: 'USER_ID_2', state: 'ACTIVE', kind: 'audio' }],
      },
    ])
  })

  test('returns participants with empty producers array if no producers match', () => {
    const users = ['USER_ID_1', 'USER_ID_2']

    const producers = [
      { userId: 'USER_ID_3', state: 'ACTIVE', kind: 'video' },
      { userId: 'USER_ID_4', state: 'INACTIVE', kind: 'screen' },
    ]

    const result = getEnrichedParticipants(users, producers)

    expect(result).toEqual([
      { id: 'USER_ID_1', producers: [] },
      { id: 'USER_ID_2', producers: [] },
    ])
  })

  test('returns participants with empty producers array if producers is null', () => {
    const users = ['USER_ID_1', 'USER_ID_2']

    const result = getEnrichedParticipants(users, null)

    expect(result).toEqual([{ id: 'USER_ID_1' }, { id: 'USER_ID_2' }])
  })
})
