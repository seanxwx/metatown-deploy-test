import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { MutatorCallback } from 'swr'

interface Indexed {
  id: string
}

function createSubscriptionMutatorCallback<
  Row extends Indexed,
  Data extends Indexed,
>(
  payload: RealtimePostgresChangesPayload<Row>,
  transformData: (row: Row) => Data
): MutatorCallback<Data[]> {
  return (data) => {
    if (payload.eventType === 'DELETE') {
      return data?.filter((record) => payload.old.id !== record.id)
    }

    const entry = transformData(payload.new)

    if (payload.eventType === 'INSERT') {
      return [...(data ?? []), entry]
    }

    return data?.map((record) =>
      record.id === payload.new.id ? entry : record
    )
  }
}

export default createSubscriptionMutatorCallback
