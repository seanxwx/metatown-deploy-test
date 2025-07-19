'use client'

import { debounce } from 'lodash'
import { FC, useEffect, useMemo, useState } from 'react'
import GradientBackground from '@/components/GradientBackground'
import LayoutContainer from '@/components/LayoutContainer'
import Filter, { Type } from './_components/Filter'
import Header from './_components/Header'
import LastVisitedSpaces from './_components/LastVisitedSpaces'
import OwnedSpaces from './_components/OwnedSpaces'
import SearchResults from './_components/SearchResults'

const Home: FC = () => {
  const [spaceType, setSpaceType] = useState<Type>('lastVisited')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)

  const handleDebounceSearchQuery = useMemo(
    () => debounce(setDebouncedSearchQuery, 500),
    []
  )

  const handleSearch = (value: string): void => {
    setSearchQuery(value)
    handleDebounceSearchQuery(value)
  }

  useEffect(() => {
    handleDebounceSearchQuery.cancel()
  }, [handleDebounceSearchQuery])

  return (
    <GradientBackground variant="dusk" className="min-h-dvh">
      <Header />
      <LayoutContainer>
        <Filter
          onToggleSpaces={(type) => setSpaceType(type)}
          type={spaceType}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        {
          {
            owned: <OwnedSpaces />,
            lastVisited: <LastVisitedSpaces />,
            searched: <SearchResults searchQuery={debouncedSearchQuery} />,
          }[spaceType]
        }
      </LayoutContainer>
    </GradientBackground>
  )
}

export default Home
