import { ChangeEvent, FC } from 'react'
import TextField from '@mui/material/TextField'
import { useField } from 'formik'

type AddItemInputProps = {
  label?: string
  disabled?: boolean
}

const AddItemInput: FC<AddItemInputProps> = ({ label, disabled }) => {
  const [{ value }, { error }, { setError, setValue }] = useField('title')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(undefined)
    setValue(e.currentTarget.value)
  }

  return (
    <TextField
      variant="outlined"
      error={!!error}
      helperText={error}
      label={label}
      disabled={disabled}
      value={value}
      onChange={handleInputChange}
      sx={{ width: 1 }}
    />
  )
}

export default AddItemInput
