import { render, screen } from '@testing-library/react'
import MuteIndicator from './MuteIndicator'

describe('MuteIndicator', () => {
  test('renders microphone off icon', () => {
    render(<MuteIndicator isMuted />)

    expect(screen.getByLabelText('Muted')).toBeInTheDocument()
  })

  test('renders microphone icon is not muted', () => {
    render(<MuteIndicator />)

    expect(screen.getByLabelText('Unmuted')).toBeInTheDocument()
  })
})
