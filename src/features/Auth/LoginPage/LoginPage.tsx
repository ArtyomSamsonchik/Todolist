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
import { login, selectCaptchaUrl, selectIsLoggedIn } from '../auth-slice'
import { validateLogin } from '../../../utils/helpers/validateLogin'
import LoginFormInput from './LoginFormInput/LoginFormInput'
import { PATH } from '../../../app/constants'
import useAppLocation from '../../../utils/hooks/useAppLocation'
import isRedirectState from '../../../utils/helpers/isRedirectState'
import LoginFormCaptcha from './LoginFormCaptcha'
import LoginFormLabel from './LoginFormLabel'

export type FormValues = {
  email: string
  password: string
  rememberMe: boolean
  captcha: string
}

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const captchaUrl = useAppSelector(selectCaptchaUrl)
  const { state: redirectState } = useAppLocation()
  const dispatch = useAppDispatch()

  const toggleIsVisible = () => {
    setIsVisible(prevVisible => !prevVisible)
  }

  if (isLoggedIn) {
    const path = isRedirectState(redirectState)
      ? { to: redirectState.from, replace: true }
      : { to: PATH.ROOT }

    return <Navigate {...path} />
  }

  return (
    <Formik
      initialValues={
        {
          email: '',
          password: '',
          rememberMe: false,
          captcha: '',
        } as FormValues
      }
      validate={validateLogin(!!captchaUrl)}
      onSubmit={async values => {
        // TODO: consider displaying validation errors in the fields of the login form
        const res = await dispatch(login(values))

        if (login.rejected.match(res) && res.payload?.scope === 'validation') {
        }
      }}
    >
      {formik => {
        return (
          <Container disableGutters component="form" maxWidth="xs" onSubmit={formik.handleSubmit}>
            <LoginFormLabel />
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
            <LoginFormCaptcha captchaUrl={captchaUrl} disabled={formik.isSubmitting} />
            <Button
              size="large"
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 1 }}
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
