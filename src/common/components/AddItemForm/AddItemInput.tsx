import { ChangeEvent, FC } from 'react'
import TextField from '@mui/material/TextField'
import { useField } from 'formik'

type AddItemInputProps = {
  isSubmitting: boolean
  label?: string
  disabled?: boolean
}

const AddItemInput: FC<AddItemInputProps> = props => {
  const { label, disabled, isSubmitting } = props

  const [{ value }, { error }, { setError, setValue }] = useField<string>('title')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(undefined)
    setValue(e.currentTarget.value)
  }

  return (
    <TextField
      variant="outlined"
      error={!!error}
      label={label}
      helperText={error || ''}
      disabled={isSubmitting || disabled}
      value={value}
      onChange={handleInputChange}
      sx={{ width: 1 }}
    />
  )
}

export default AddItemInput
