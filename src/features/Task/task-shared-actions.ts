import { AppThunk } from '../../app/store'
import { setAppStatus } from '../../app/app-slice'
import { Task, taskAPI } from './task-api'
import { handleError } from '../../utils/helpers/handleErrors'
import { createAction } from '@reduxjs/toolkit'

export const initTasks = createAction<{ todoId: string; tasks: Task[] }>('tasks/initTasks')

export const fetchTasksTC =
  (todoId: string): AppThunk =>
  dispatch => {
    dispatch(setAppStatus('pending'))
    // dispatch(setTodolistStatus({ todoId, status: 'fetchingTasks' }))
    taskAPI
      .getTasks(todoId)
      .then(({ data }) => {
        if (!data.error) {
          dispatch(initTasks({ todoId, tasks: data.items }))
          dispatch(setAppStatus('success'))
          // dispatch(setTodolistStatus({ todoId, status: 'success' }))
        } else {
          const message = data.error || 'Something went wrong!'
          throw new Error(message)
        }
      })
      .catch(e => {
        handleError(e, dispatch)
        // dispatch(setTodolistStatus({ todoId, status: 'failure' }))
      })
  }
