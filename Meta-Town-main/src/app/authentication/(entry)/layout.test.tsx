import { render, screen } from '@testing-library/react'
import Layout from './layout'

describe('Layout', () => {
  test('renders background', () => {
    render(
      <Layout>
        <div>Test Background</div>
      </Layout>
    )

    expect(screen.getByAltText('Wave Background')).toBeInTheDocument()
  })

  test('renders logo', async () => {
    render(
      <Layout>
        <div>Test Logo</div>
      </Layout>
    )

    expect(await screen.findByLabelText('Meta Town')).toBeInTheDocument()
  })

  test('renders children', () => {
    render(
      <Layout>
        <div>Test Children</div>
      </Layout>
    )

    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })
})
