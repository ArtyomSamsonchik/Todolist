import React, { ChangeEvent, FC, useState, KeyboardEvent } from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Cancel from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import EditableSpanInput from './EditableSpanInput'
import { EditableSpanContainer } from './styled'
import { BASIC_ERROR_MESSAGE } from '../../../app/constants'
import FormHelperText from '@mui/material/FormHelperText'
import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'

type EditableSpanProps = {
  children: string
  disabled?: boolean
  changeTitle: (title: string) => Promise<any> | void
  onToggleEditMode?: (isEditing: boolean) => void
  sx?: SxProps<Theme>
  typographyProps?: TypographyProps
}

const EditableSpan: FC<EditableSpanProps> = React.memo(props => {
  const { children, changeTitle, disabled, onToggleEditMode, sx, typographyProps } = props

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

      if (e instanceof Error) message = e.message
      else if (typeof e === 'string') message = e
      else message = BASIC_ERROR_MESSAGE

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

  return (
    <EditableSpanContainer sx={sx}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {editMode ? (
          <EditableSpanInput
            autoFocus
            error={!!error}
            disabled={disabled}
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeydown}
          />
        ) : (
          <Typography
            noWrap
            component="span"
            {...typographyProps}
            color={`text.${disabled ? 'disabled' : 'primary'}`}
          >
            {children}
          </Typography>
        )}
        {editMode ? (
          <>
            <IconButton sx={{ ml: 1 }} disabled={disabled} onClick={disableEditMode}>
              <Cancel />
            </IconButton>
            <IconButton disabled={disabled || !!error} onClick={commitNewTitle}>
              <AssignmentTurnedInIcon />
            </IconButton>
          </>
        ) : (
          <IconButton sx={{ mx: 1 }} disabled={disabled} onClick={activateEditMode}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <FormHelperText sx={{ pl: 0.5, pr: 11.5, textAlign: 'center' }} error={!!error}>
        {error}
      </FormHelperText>
    </EditableSpanContainer>
  )
})

export default EditableSpan
