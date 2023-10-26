import React from 'react'
import Typography from '@mui/material/Typography'
import FormLabel from '@mui/material/FormLabel'

const LoginFormLabel = () => {
  return (
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
  )
}

export default LoginFormLabel