import React, { useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorSnackbar from '../common/components/ErrorSnackbar/ErrorSnackbar'
import { useAppDispatch, useAppSelector } from '../utils/hooks/hooks'
import { selectIsInit } from './app-slice'
import { authMe } from '../features/Auth/auth-shared-actions'

const App = () => {
  const isInitialized = useAppSelector(selectIsInit)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authMe())
  }, [dispatch])

  return (
    <>
      <CssBaseline enableColorScheme />
      <AppBar />
      <Backdrop open={!isInitialized} sx={{ zIndex: 1110 }}>
        <CircularProgress thickness={5} size={70} sx={{ color: '#fff' }} />
      </Backdrop>
      <Box sx={{ mt: { xs: 10, sm: 11 } }}>{isInitialized && <Outlet />}</Box>
      <ErrorSnackbar />
    </>
  )
}

export default App
