import { type Meta, type StoryObj } from '@storybook/react'
import TextField from './TextField'

const meta = {
  title: 'Design/TextField',
  component: TextField,
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
