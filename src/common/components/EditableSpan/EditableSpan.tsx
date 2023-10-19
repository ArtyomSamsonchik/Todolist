import React, { ChangeEvent, FC, KeyboardEvent, useState } from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Cancel from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import EditableSpanInput from './EditableSpanInput'
import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import isAppError from '../../../utils/helpers/isAppError'

type EditableSpanProps = {
  children: string
  disabled?: boolean
  changeTitle: (title: string) => Promise<any> | void
  onToggleEditMode?: (isEditing: boolean) => void
  sx?: SxProps<Theme>
  typographyProps?: Omit<TypographyProps, 'sx'>
}

const EditableSpan: FC<EditableSpanProps> = React.memo(props => {
  const { children, changeTitle, disabled, onToggleEditMode, sx, typographyProps } = props

  const [title, setTitle] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(children)
    onToggleEditMode?.(true)
  }

  const disableEditMode = () => {
    setEditMode(false)
    setError(undefined)
    setTitle('')
    onToggleEditMode?.(false)
  }

  const commitNewTitle = async () => {
    try {
      await changeTitle(title.replace(/\s+/gm, ' ').trim())
      disableEditMode()
    } catch (e) {
      if (isAppError(e) && e.scope === 'validation') {
        setError(e.message)
      } else {
        throw e
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(undefined)

    setTitle(e.currentTarget.value)
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') disableEditMode()
    else if (e.ctrlKey && e.key === 'Enter') commitNewTitle()
  }

  return (
    <Box display="flex" alignItems="flex-start" width={1} sx={sx}>
      {editMode ? (
        <EditableSpanInput
          error={error}
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
          sx={{ flexGrow: 1, pt: 1 }}
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
  )
})

export default EditableSpan
