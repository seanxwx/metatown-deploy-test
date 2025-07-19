const getEnrichedParticipants = <T extends { userId: string }>(
  users: string[],
  producers?: T[] | null
): { id: string; producers?: T[] }[] =>
  users.map((user) => ({
    id: user,
    producers: producers?.filter((producer) => producer.userId === user),
  }))

export default getEnrichedParticipants
