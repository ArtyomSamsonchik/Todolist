import { Meta, StoryObj } from '@storybook/react'
import AddItemForm from './AddItemForm'
import { createAppError } from '../../../utils/helpers/createAppError'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

const meta = {
  component: AddItemForm,
  title: 'Common/AddItemForm',
  tags: ['autodocs'],
  argTypes: {
    addItemCallback: {
      action: 'onAddItem',
    },
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: '350px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddItemForm>

export default meta
type Story = StoryObj<typeof meta>

const errorMessage = 'Title is required'

export const Default: Story = {
  args: { label: 'add new item' },
  render: ({ addItemCallback, ...restProps }) => {
    const onAddItem = (value: string) => {
      addItemCallback(value)

      if (!value.trim()) {
        throw createAppError(errorMessage, 'validation', {})
      }
    }

    return <AddItemForm addItemCallback={onAddItem} {...restProps} />
  },
}

export const Error: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const addItemIcon = canvas.getByTestId('AddBoxIcon')

    await userEvent.click(addItemIcon)
    await expect(canvas.getByText(errorMessage)).toBeInTheDocument()
    await expect(addItemIcon.closest('button')).toBeDisabled()
  },
}
