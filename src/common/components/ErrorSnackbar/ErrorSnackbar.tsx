import React from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useAppDispatch, useAppSelector } from '../../../utils/hooks/hooks'
import {
  resetTodolistsError,
  selectTodolistsError,
} from '../../../features/Todolist/todolist-slice'
import { MaybeEmpty } from '../../../utils/helpers/types'
import { resetTasksError, selectTasksError } from '../../../features/Task/task-slice'

// outer var to prevent snackbar from jerking when the error message is set to null
let message: MaybeEmpty<string> = ''

const ErrorSnackbar = React.memo(() => {
  const todolistError = useAppSelector(selectTodolistsError)
  const tasksError = useAppSelector(selectTasksError)
  const dispatch = useAppDispatch()

  const snackbarError = todolistError || tasksError

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return

    dispatch(resetTodolistsError())
    dispatch(resetTasksError())
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
