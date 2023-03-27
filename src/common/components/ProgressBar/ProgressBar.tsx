import React from 'react'
import { useAppSelector } from '../../../utils/hooks/hooks'
import { selectAppStatus } from '../../../app/app-slice'
import LinearProgress from '@mui/material/LinearProgress'
import { selectTodolistsStatus } from '../../../features/Todolist/todolist-slice'

const ProgressBar = () => {
  const appStatus = useAppSelector(selectAppStatus)
  const todosStatus = useAppSelector(selectTodolistsStatus)

  // const isLoading = appStatus === 'pending' || todosStatus === 'pending'
  const isLoading = todosStatus === 'pending'

  return isLoading ? <LinearProgress color="secondary" /> : null
}

export default ProgressBar
