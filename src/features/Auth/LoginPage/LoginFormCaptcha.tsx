import React, { FC } from 'react'
import Box from '@mui/material/Box'
import LoginFormInput from './LoginFormInput/LoginFormInput'

type LoginFormCaptchaProps = {
  captchaUrl: string | null
  disabled?: boolean
}

const LoginFormCaptcha: FC<LoginFormCaptchaProps> = ({ captchaUrl, disabled }) => {
  return captchaUrl ? (
    <Box mt={1} mb={0.5} display="flex" flexDirection="column" width="max(200px, 60%)">
      <img style={{ width: '100%', aspectRatio: 2 }} src={captchaUrl} alt="captcha" />
      <LoginFormInput autoFocus name="captcha" label="captcha" size="small" disabled={disabled} />
    </Box>
  ) : null
}

export default LoginFormCaptcha
