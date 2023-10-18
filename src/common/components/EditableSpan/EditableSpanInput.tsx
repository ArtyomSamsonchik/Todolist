import { FC } from 'react'
import { filledInputClasses } from '@mui/material/FilledInput'
import TextField, { FilledTextFieldProps } from '@mui/material/TextField'

const bgColors = {
  default: 'rgba(25, 118, 210, 0.06)',
  disabled: 'rgba(102, 102, 102, 0.12)',
  hover: 'rgba(25, 118, 210, 0.09)',
  error: 'rgba(211, 47, 47, 0.07)',
  errorHover: 'rgba(211, 47, 47, 0.10)',
}
const { root, focused, error, disabled } = filledInputClasses

export type EditableSpanInputProps = Omit<FilledTextFieldProps, 'variant' | 'children'>

const EditableSpanInput: FC<EditableSpanInputProps> = props => {
  const { InputProps, sx, ...restProps } = props

  return (
    <TextField
      variant="filled"
      InputProps={{ disableUnderline: true, ...InputProps }}
      multiline
      {...restProps}
      sx={{
        flexGrow: 1,
        [`& .${root}`]: {
          p: 1,
          // fragile order based on priority
          backgroundColor: bgColors.default,
          [`&.${focused}`]: { backgroundColor: bgColors.default },
          '&:hover': { backgroundColor: bgColors.hover },
          [`&.${error}`]: { backgroundColor: bgColors.error },
          [`&.${error}:hover`]: { backgroundColor: bgColors.errorHover },
          [`&.${disabled}`]: { backgroundColor: bgColors.disabled },
        },
        ...sx,
      }}
    />
  )
}

export default EditableSpanInput
