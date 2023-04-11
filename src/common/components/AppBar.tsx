import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MuiAppBar from '@mui/material/AppBar'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { logout, selectAuthStatus, selectIsLoggedIn } from '../../features/Auth/auth-slice'
import Button from '@mui/material/Button'
import ProgressBar from './ProgressBar/ProgressBar'

const AppBar = React.memo(() => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const authStatus = useAppSelector(selectAuthStatus)
  const dispatch = useAppDispatch()

  const handleLogout = () => dispatch(logout())

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        {isLoggedIn && (
          <Button
            color="inherit"
            size="large"
            disabled={authStatus === 'pending'}
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
