import { ChangeEvent, FC, KeyboardEvent } from 'react'
import { filledInputClasses as inputClasses } from '@mui/material/FilledInput'
import TextField from '@mui/material/TextField'

const bgColors = {
  default: 'rgba(25, 118, 210, 0.06)',
  disabled: 'rgba(102, 102, 102, 0.12)',
  hover: 'rgba(25, 118, 210, 0.09)',
  error: 'rgba(211, 47, 47, 0.07)',
  errorHover: 'rgba(211, 47, 47, 0.10)',
}

export type EditableSpanInputProps = {
  error?: string
  disabled?: boolean
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

const EditableSpanInput: FC<EditableSpanInputProps> = ({ error, ...restProps }) => {
  return (
    <TextField
      variant="filled"
      autoFocus
      multiline
      error={!!error}
      helperText={error}
      InputProps={{
        disableUnderline: true,
        sx: {
          p: 1,
          [`&, &.${inputClasses.focused}`]: { backgroundColor: bgColors.default },
          '&:hover': { backgroundColor: bgColors.hover },
          [`&.${inputClasses.error}`]: { backgroundColor: bgColors.error },
          [`&:where(.${inputClasses.error}):hover`]: {
            backgroundColor: bgColors.errorHover,
          },
          [`&.${inputClasses.disabled}`]: { backgroundColor: bgColors.disabled },
        },
      }}
      sx={{ flexGrow: 1 }}
      {...restProps}
    />
  )
}

export default EditableSpanInput
