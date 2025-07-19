import { render, screen } from '@testing-library/react'
import TeamMemberList, { TEAM_MEMBERS } from './TeamMemberList'

describe('TeamMemberList', () => {
  test.each(TEAM_MEMBERS)('renders team member s%', ({ displayName }) => {
    render(<TeamMemberList />)

    expect(screen.getByText(displayName)).toBeInTheDocument()
  })
})
