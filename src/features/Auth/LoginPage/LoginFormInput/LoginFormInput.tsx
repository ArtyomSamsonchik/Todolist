import { TextFieldProps } from '@mui/material/TextField/TextField'
import React, { FC } from 'react'
import { useField } from 'formik'
import TextField from '@mui/material/TextField'
import { FormValues } from '../LoginPage'

type LoginFormInputProps = TextFieldProps & { name: keyof FormValues }

const LoginFormInput: FC<LoginFormInputProps> = ({ name, ...props }) => {
  const [field, { touched, error }] = useField(name)

  return (
    <TextField
      fullWidth
      margin="dense"
      variant="filled"
      error={touched && !!error}
      helperText={error}
      {...field}
      {...props}
    />
  )
}

export default LoginFormInput
