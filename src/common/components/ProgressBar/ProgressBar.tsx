import React from 'react'
import { useAppSelector } from '../../../utils/hooks/hooks'
import LinearProgress from '@mui/material/LinearProgress'
import { selectTodolistsStatus } from '../../../features/Todolist/todolist-slice'
import { selectTasksStatus } from '../../../features/Task/task-slice'

const ProgressBar = () => {
  const todosStatus = useAppSelector(selectTodolistsStatus)
  const tasksStatus = useAppSelector(selectTasksStatus)
  
  const isLoading = todosStatus === 'pending' || tasksStatus === 'pending'

  return isLoading ? <LinearProgress color="secondary" /> : null
}

export default ProgressBar
