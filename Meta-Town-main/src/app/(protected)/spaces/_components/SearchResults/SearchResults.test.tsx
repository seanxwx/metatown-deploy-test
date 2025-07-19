import { describe, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import useSearchSpaces from '@/hooks/useSearchSpaces'
import useUserPresences from '@/hooks/useUserPresences'
import useSessionUser from '@/hooks/useSessionUser'
import SearchResults from './SearchResults'

vi.mock('@/hooks/useSearchSpaces')
const useSearchSpacesMock = vi.mocked(useSearchSpaces)

vi.mock('@/hooks/useUserPresences')
const useUserPresencesMock = vi.mocked(useUserPresences)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('SearchResults', () => {
  test('renders loading when search results are loading', () => {
    useSearchSpacesMock.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useSearchSpaces>)

    render(<SearchResults searchQuery="Space Name" />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  test('renders "No spaces found!" message when no spaces are found', () => {
    vi.mocked(useSearchSpaces).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useSearchSpaces>)

    render(<SearchResults searchQuery="test" />)

    expect(screen.getByText('No spaces found!')).toBeInTheDocument()
  })

  test('renders searched spaces result when results are available', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useUserPresencesMock.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof useUserPresences>)

    useSearchSpacesMock.mockReturnValue({
      data: [
        {
          id: 'SPACE_ID',
          name: 'Space Name',
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useSearchSpaces>)

    render(<SearchResults searchQuery="Space" />)

    expect(screen.getByText('Space Name')).toBeInTheDocument()
  })
})
