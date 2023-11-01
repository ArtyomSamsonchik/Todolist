import React, { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '../../../utils/hooks/hooks'
import LinearProgress from '@mui/material/LinearProgress'
import { selectTodolistsStatus } from '../../../features/Todolist/todolist-slice'
import { selectTasksStatus } from '../../../features/Task/task-slice'
import { selectAuthStatus } from '../../../features/Auth/auth-slice'
import { debounce } from '@mui/material'

const ProgressBar = () => {
  const [loading, setLoading] = useState(false)
  const setDebouncedLoading = useMemo(() => debounce(setLoading, 500), [])

  const todosStatus = useAppSelector(selectTodolistsStatus)
  const tasksStatus = useAppSelector(selectTasksStatus)
  const authStatus = useAppSelector(selectAuthStatus)

  const requestIsPending =
    todosStatus === 'pending' || tasksStatus === 'pending' || authStatus === 'pending'

  // remove progress bar on fast completion of several consecutive requests
  useEffect(() => {
    if (requestIsPending) {
      setLoading(true)
    } else {
      setDebouncedLoading(false)
    }
  }, [requestIsPending])

  return loading ? <LinearProgress color="secondary" /> : null
}

export default ProgressBar
