import { render, screen } from '@testing-library/react'
import AboutTheTeam from './AboutTheTeam'

describe('AboutTheTeam', () => {
  test('renders TeamMemberList', () => {
    render(<AboutTheTeam />)

    expect(
      screen.getByRole('List', { name: 'Team members' })
    ).toBeInTheDocument()
  })
})
