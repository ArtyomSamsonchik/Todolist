import { Meta, StoryObj } from '@storybook/react'
import EditableSpan from './EditableSpan'
import { createAppError } from '../../../utils/helpers/createAppError'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

const meta = {
  title: 'Common/EditableSpan',
  tags: ['autodocs'],
  component: EditableSpan,
  decorators: [
    Story => (
      <div style={{ maxWidth: 250 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    changeTitle: { action: 'onChangeTitle' },
  },
} satisfies Meta<typeof EditableSpan>

export default meta
type Story = StoryObj<typeof meta>

const emptyTitleError = 'Title is required'
const defaultTitle = 'default title'
const largeTitle =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae est expedita fugit molestias'

export const Default: Story = {
  args: { children: defaultTitle },
  render: ({ changeTitle, ...restProps }) => {
    const onChangeTitle = (title: string) => {
      changeTitle(title)

      if (!title.trim()) {
        throw createAppError(emptyTitleError, 'validation', {})
      }
    }

    return <EditableSpan changeTitle={onChangeTitle} {...restProps} />
  },
}

export const EditModeEnabled: Story = {
  ...Default,
  play: async ({ canvasElement, args: { children } }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByTestId('EditIcon'))
    await expect(canvas.getByRole('textbox')).toHaveValue(children)
    await expect(canvas.getByTestId('CancelIcon')).toBeInTheDocument()
    await expect(canvas.getByTestId('AssignmentTurnedInIcon')).toBeInTheDocument()
  },
}
export const LargeTitle: Story = {
  ...Default,
  args: {
    ...Default.args,
    children: largeTitle,
  },
}

export const EditModeWithLargeTitle: Story = {
  ...LargeTitle,
  play: EditModeEnabled.play,
}

export const Error: Story = {
  ...Default,
  play: async ctx => {
    const canvas = within(ctx.canvasElement)

    await ctx.step('open edit mode', EditModeEnabled.play!)

    await ctx.step('submit empty title', async () => {
      await userEvent.clear(canvas.getByText(defaultTitle))

      const submitButtonIcon = canvas.getByTestId('AssignmentTurnedInIcon')
      await userEvent.click(submitButtonIcon)

      await expect(submitButtonIcon.closest('button')).toBeDisabled()
      await expect(canvas.getByText(emptyTitleError)).toBeInTheDocument()
    })
  },
}
