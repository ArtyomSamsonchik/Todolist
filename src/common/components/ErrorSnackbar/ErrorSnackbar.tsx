import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useAppDispatch, useAppSelector } from '../../../utils/hooks/hooks'
import { selectAppError, setAppError } from '../../../app/app-slice'
import {
  resetTodolistsError,
  selectTodolistsError,
} from '../../../features/Todolist/todolist-slice'
import { MaybeEmpty } from '../../../utils/helpers/types'

// outer var to prevent snackbar from jerking when the error message is set to null
let message: MaybeEmpty<string> = ''

const ErrorSnackbar = React.memo(() => {
  const appError = useAppSelector(selectAppError)
  const todolistError = useAppSelector(selectTodolistsError)
  const [snackbarError, setSnackbarError] = useState<MaybeEmpty<string>>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setSnackbarError(appError || todolistError)
  }, [appError, todolistError])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return

    dispatch(resetTodolistsError())
    dispatch(setAppError(null))
  }

  if (snackbarError) message = snackbarError

  return (
    <Snackbar open={!!snackbarError} autoHideDuration={6000} onClose={handleClose}>
      <Alert elevation={6} variant="filled" severity="error" onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  )
})

export default ErrorSnackbar
