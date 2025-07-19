type ActiveScreenProducer<T> = T & { state: 'ACTIVE'; kind: 'screen' }

interface Producer {
  userId: string
  state: string
  kind: string
}

const getScreenProducer = <T extends Producer>(
  users: string[],
  producers?: T[] | null
): ActiveScreenProducer<T> | undefined =>
  producers?.find((producer): producer is ActiveScreenProducer<T> => {
    const isParticipant = !!users.find((user) => user === producer.userId)
    const isActive = producer.state === 'ACTIVE'
    const isScreen = producer.kind === 'screen'

    return isParticipant && isActive && isScreen
  })

export default getScreenProducer
