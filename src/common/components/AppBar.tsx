import React, { useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MuiAppBar from '@mui/material/AppBar'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { logoutTC, selectIsLoggedIn } from '../../features/Auth/auth-slice'
import Button from '@mui/material/Button'
import ProgressBar from './ProgressBar/ProgressBar'

const AppBar = React.memo(() => {
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    setButtonDisabled(true)
    dispatch(logoutTC()).then(() => {
      setButtonDisabled(false)
    })
  }

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        {isLoggedIn && (
          <Button
            color="inherit"
            size="large"
            disabled={buttonDisabled}
            sx={{ ml: { sx: 0, sm: 3 } }}
            onClick={handleLogout}
          >
            Log out
          </Button>
        )}
        <Typography
          variant="h5"
          sx={{ top: '50%', left: '50%', translate: '-50% -50%', position: 'absolute' }}
        >
          Todolist
        </Typography>
      </Toolbar>
      <ProgressBar />
    </MuiAppBar>
  )
})

export default AppBar
