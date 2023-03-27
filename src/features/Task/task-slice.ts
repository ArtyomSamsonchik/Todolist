import { ResultCode } from '../../app/api-instance'
import { AppThunk, RequestStatus, RootState } from '../../app/store'
import { setAppStatus } from '../../app/app-slice'
import { handleError } from '../../utils/helpers/handleErrors'
import { AxiosError } from 'axios'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createTaskDomainEntity } from '../../utils/helpers/createTaskDomainEntity'
import { Task, taskAPI, TaskStatus } from './task-api'
import { initTasks } from './task-shared-actions'
import { addTodolist, deleteTodolist, fetchTodolists, Filter } from '../Todolist/todolist-slice'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'

const taskSlice = createSlice({
  name: 'task',
  initialState: {} as TasksState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      const { todoListId } = action.payload
      const newTask: TaskDomain = createTaskDomainEntity(action.payload)

      state[todoListId].unshift(newTask)
    },
    deleteTask(state, action: PayloadAction<{ todoId: string; taskId: string }>) {
      const { todoId, taskId } = action.payload
      const index = state[todoId].findIndex(t => t.id === taskId)

      if (index !== -1) state[todoId].splice(index, 1)
    },
    updateTask(state, action: PayloadAction<Task>) {
      const newTask = action.payload
      const { todoListId } = action.payload
      const index = state[todoListId].findIndex(t => t.id === newTask.id)

      state[todoListId][index] = createTaskDomainEntity(newTask)
    },
    setTaskStatus(
      state,
      action: PayloadAction<{ todoId: string; taskId: string; status: RequestStatus }>
    ) {
      const { todoId, taskId, status } = action.payload
      const index = state[todoId].findIndex(t => t.id === taskId)

      if (index !== -1) state[todoId][index].entityStatus = status
    },
    cleanTasks(state) {
      state = {}
    },
  },
  extraReducers: builder => {
    builder.addCase(initTasks, (state, action) => {
      const { todoId, tasks } = action.payload

      state[todoId] = tasks.map(t => createTaskDomainEntity(t))
    })
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      action.payload.forEach(tl => {
        state[tl.id] = []
      })
    })
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state[action.payload.id] = []
    })
    builder.addCase(deleteTodolist.fulfilled, (state, action) => {
      delete state[action.payload.todoId]
    })
  },
})

export const addTaskTC =
  (todoId: string, title: string): AppThunk<Promise<void>> =>
  dispatch => {
    dispatch(setAppStatus('pending'))
    return taskAPI
      .addTask(todoId, title)
      .then(({ data }) => {
        if (data.resultCode === ResultCode.Ok) {
          dispatch(addTask(data.data.item))
          dispatch(setAppStatus('success'))
        } else {
          const message = data.messages[0] || 'Something went wrong!'
          throw new Error(message)
        }
      })
      .catch(e => {
        handleError(e, dispatch)
      })
  }

export const deleteTaskTC =
  (todoId: string, taskId: string): AppThunk =>
  dispatch => {
    dispatch(setAppStatus('pending'))
    dispatch(setTaskStatus({ todoId, taskId, status: 'pending' }))
    taskAPI
      .deleteTask(todoId, taskId)
      .then(({ data }) => {
        if (data.resultCode === ResultCode.Ok) {
          dispatch(deleteTask({ todoId, taskId }))
          dispatch(setAppStatus('success'))
        } else {
          const message = data.messages[0] || 'Something went wrong!'
          throw new Error(message)
        }
      })
      .catch((e: Error | AxiosError) => {
        handleError(e, dispatch)
        dispatch(setTaskStatus({ todoId, taskId, status: 'failure' }))
      })
  }

export const updateTaskTC =
  (todoId: string, taskId: string, patch: Partial<TaskModel>): AppThunk =>
  (dispatch, getState) => {
    const task = selectTask(getState(), todoId, taskId)
    const model: TaskModel = {
      description: task.description,
      title: task.title,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      addedDate: task.addedDate,
      ...patch,
    }

    dispatch(setAppStatus('pending'))
    dispatch(setTaskStatus({ todoId, taskId, status: 'pending' }))
    taskAPI
      .updateTask(todoId, taskId, model)
      .then(({ data }) => {
        if (data.resultCode === ResultCode.Ok) {
          dispatch(updateTask(data.data.item))
          dispatch(setAppStatus('success'))
          dispatch(setTaskStatus({ todoId, taskId, status: 'success' }))
        } else {
          const message = data.messages[0] || 'Something went wrong!'
          throw new Error(message)
        }
      })
      .catch((e: Error | AxiosError) => {
        handleError(e, dispatch)
        dispatch(setTaskStatus({ todoId, taskId, status: 'failure' }))
      })
  }

export const selectTasks = (state: RootState, todoId: string) => state.tasks[todoId]
// Use this factory inside useMemo in Todolist component to provide every Todolist
// instance his own selector.
export const filteredTasksSelectorFactory = () => {
  const selectFilteredTasks = createSelector(
    (state: RootState, todoId: string) => selectTasks(state, todoId),
    (state: RootState, todoId: string, filter: Filter) => filter,
    (tasks, filter) => {
      if (filter === 'active') {
        return tasks.filter(t => t.status === TaskStatus.Uncompleted)
      }
      if (filter === 'completed') {
        return tasks.filter(t => t.status === TaskStatus.Completed)
      }

      return tasks
    }
  )

  const selectFilteredTaskIds = createSelector(selectFilteredTasks, tasks => tasks.map(t => t.id), {
    memoizeOptions: {
      resultEqualityCheck: shallowEqual,
    },
  })

  return { selectFilteredTasks, selectFilteredTaskIds }
}
export const selectTask = (state: RootState, todoId: string, taskId: string) => {
  return selectTasks(state, todoId).find(t => t.id === taskId) as TaskDomain
}

export const { addTask, deleteTask, updateTask, setTaskStatus, cleanTasks } = taskSlice.actions

export default taskSlice.reducer

export type TaskDomain = Task & {
  entityStatus: RequestStatus
}

export type TaskModel = Omit<Task, 'id' | 'todoListId' | 'order' | 'deadline'>
export type TasksState = Record<string, TaskDomain[]>
