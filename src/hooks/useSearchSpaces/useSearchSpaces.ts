import useSWR, { SWRResponse } from 'swr'
import searchSpaces from '@/db/searchSpaces'

type Spaces = Awaited<ReturnType<typeof searchSpaces>>

const useSearchSpaces = (query: string): SWRResponse<Spaces> =>
  useSWR<Spaces>(query ? ['search-spaces', query] : null, searchSpaces)

export default useSearchSpaces
