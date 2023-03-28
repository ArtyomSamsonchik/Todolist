import React from 'react'
import { useAppSelector } from '../../../utils/hooks/hooks'
import LinearProgress from '@mui/material/LinearProgress'
import { selectTodolistsStatus } from '../../../features/Todolist/todolist-slice'
import { selectTasksStatus } from '../../../features/Task/task-slice'
import { selectAuthStatus } from '../../../features/Auth/auth-slice'

const ProgressBar = () => {
  const todosStatus = useAppSelector(selectTodolistsStatus)
  const tasksStatus = useAppSelector(selectTasksStatus)
  const authStatus = useAppSelector(selectAuthStatus)

  const isLoading =
    todosStatus === 'pending' || tasksStatus === 'pending' || authStatus === 'pending'

  return isLoading ? <LinearProgress color="secondary" /> : null
}

export default ProgressBar
