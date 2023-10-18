import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { Formik } from 'formik'
import Checkbox from '@mui/material/Checkbox'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../utils/hooks/hooks'
import { login, selectIsLoggedIn } from '../auth-slice'
import { validateLogin } from '../../../utils/helpers/validateLogin'
import LoginFormInput from './LoginFormInput/LoginFormInput'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import { PATH } from '../../../app/constants'

export type FormValues = {
  email: string
  password: string
  rememberMe: boolean
}

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const toggleIsVisible = () => {
    setIsVisible(prevVisible => !prevVisible)
  }

  if (isLoggedIn) {
    return <Navigate to={`/${PATH.TODOLIST}`} replace />
  }

  return (
    <Formik
      initialValues={
        {
          email: '',
          password: '',
          rememberMe: false,
        } as FormValues
      }
      validate={validateLogin}
      onSubmit={values => dispatch(login(values))}
    >
      {formik => {
        return (
          <Container component="form" maxWidth="xs" onSubmit={formik.handleSubmit}>
            <FormLabel>
              <Typography variant="body1" mb={2} sx={{ lineHeight: 1.7 }}>
                To log in get registered
                <a
                  href="https://social-network.samuraijs.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: 6 }}
                >
                  here
                </a>
                <br />
                or use common test account credentials:
                <br />
                Email: free@samuraijs.com
                <br />
                Password: free
              </Typography>
            </FormLabel>
            <LoginFormInput name="email" label="email" disabled={formik.isSubmitting} />
            <LoginFormInput
              name="password"
              label="password"
              type={isVisible ? 'text' : 'password'}
              disabled={formik.isSubmitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton disabled={formik.isSubmitting} onClick={toggleIsVisible}>
                      {isVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              sx={{ mt: 1, mb: 0.5 }}
              control={
                <Checkbox disabled={formik.isSubmitting} {...formik.getFieldProps('rememberMe')} />
              }
              label="Remember me"
            />
            <Button
              size="large"
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 0.5 }}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Login
            </Button>
          </Container>
        )
      }}
    </Formik>
  )
}

export default LoginPage
