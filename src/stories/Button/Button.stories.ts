import { type Meta, type StoryObj } from '@storybook/react'
import Button from './Button'
import Icon from './Icon'
import Configurable from './Configurable'

const meta = {
  title: 'Design/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: Button,
}

export const ButtonIcon: Story = {
  render: Icon,
}

export const ButtonConfigurable: Story = {
  render: Configurable,
}
