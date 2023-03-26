import { TextFieldProps } from '@mui/material/TextField/TextField'
import React, { FC } from 'react'
import { useFormikContext } from 'formik'
import TextField from '@mui/material/TextField'
import { FormValues } from '../LoginPage'

type LoginFormInputProps = TextFieldProps & { name: keyof FormValues }

const LoginFormInput: FC<LoginFormInputProps> = ({ name, ...props }) => {
  const { errors, touched, getFieldProps } = useFormikContext<FormValues>()

  return (
    <TextField
      fullWidth
      margin="dense"
      variant="filled"
      error={touched[name] && !!errors[name]}
      helperText={errors[name]}
      {...getFieldProps(name)}
      {...props}
    />
  )
}

export default LoginFormInput
