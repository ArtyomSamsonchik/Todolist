import React, { ChangeEvent, FC, useState, KeyboardEvent, useRef, FocusEvent } from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import EditableSpanInput from './EditableSpanInput'
import { EditableSpanContainer } from './styled'

type EditableSpanProps = {
  children: string
  disabled?: boolean
  changeTitle: (title: string) => Promise<any> | void
  onToggleEditMode?: (isEditing: boolean) => void
} & TypographyProps

const EditableSpan: FC<EditableSpanProps> = React.memo(props => {
  const { children, changeTitle, disabled, onToggleEditMode, ...restProps } = props

  const [title, setTitle] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(children)
    onToggleEditMode?.(true)
  }

  const disableEditMode = () => {
    setEditMode(false)
    setError(null)
    setTitle('')
    onToggleEditMode?.(false)
  }

  const commitNewTitle = async () => {
    try {
      await changeTitle(title.replace(/\s+/gm, ' ').trim())
      disableEditMode()
    } catch (e) {
      let message: string

      if (e instanceof Error) message = e.name
      else if (typeof e === 'string') message = e
      else message = 'Some error occurred'

      setError(message)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)

    setTitle(e.currentTarget.value)
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') disableEditMode()
  }

  const handleActionButtonClick = () => (editMode ? commitNewTitle() : activateEditMode())

  const iconButtonRef = useRef<HTMLButtonElement>(null)

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget === iconButtonRef?.current) return

    disableEditMode()
  }

  return (
    <EditableSpanContainer>
      {editMode ? (
        <EditableSpanInput
          autoFocus
          error={!!error}
          disabled={disabled}
          value={title}
          helperText={error || ''}
          onChange={handleChange}
          onKeyDown={handleKeydown}
          onBlur={handleBlur}
        />
      ) : (
        <Typography
          noWrap
          component="span"
          {...restProps}
          color={`text.${disabled ? 'disabled' : 'primary'}`}
          // onDoubleClick={activateEditMode}
        >
          {children}
        </Typography>
      )}
      <IconButton
        ref={iconButtonRef}
        sx={{ ml: 1 }}
        disabled={disabled}
        onClick={handleActionButtonClick}
      >
        {editMode ? <AssignmentTurnedInIcon /> : <EditIcon />}
      </IconButton>
    </EditableSpanContainer>
  )
})

export default EditableSpan
