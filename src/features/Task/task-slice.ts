import { ResultCode } from '../../app/api-instance'
import { RootState, State } from '../../app/store'
import { createSlice } from '@reduxjs/toolkit'
import { Task, taskAPI, TaskStatus } from './task-api'
import { fetchTasks } from './task-shared-actions'
import { addTodolist, deleteTodolist, fetchTodolists, Filter } from '../Todolist/todolist-slice'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { basicErrorMessage } from '../../app/basic-error-message'
import { logout } from '../Auth/auth-slice'
import {
  createAppAsyncThunk,
  isFulfilledAction,
  isPendingAction,
  isRejectedAction,
} from '../../app/app-async-thunk'

// thunks
export const addTask = createAppAsyncThunk(
  'task/addTask',
  async (arg: { todoId: string; title: string }, { rejectWithValue }) => {
    try {
      const { todoId, title } = arg
      const { data } = await taskAPI.addTask(todoId, title)

      if (data.resultCode === ResultCode.Ok) return { todoId, task: data.data.item }

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)

export const deleteTask = createAppAsyncThunk(
  'task/deleteTask',
  async (arg: { todoId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const { todoId, taskId } = arg
      const { data } = await taskAPI.deleteTask(todoId, taskId)

      if (data.resultCode === ResultCode.Ok) return { todoId, taskId }

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)

export const updateTask = createAppAsyncThunk(
  'task/updateTask',
  async (
    arg: { todoId: string; taskId: string; patch: Partial<TaskModel> },
    { rejectWithValue, getState }
  ) => {
    try {
      const { todoId, taskId, patch } = arg
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

      const { data } = await taskAPI.updateTask(todoId, taskId, model)

      if (data.resultCode === ResultCode.Ok) return data.data.item

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)

// slice
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    entities: {},
    status: 'idle',
    error: null,
    pendingTaskId: null,
  } as TaskState,
  reducers: {
    resetTasksError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const { todoId, tasks } = action.payload

        state.entities[todoId] = tasks
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { todoId, task } = action.payload

        state.entities[todoId].unshift(task)
      })
      .addCase(deleteTask.pending, (state, action) => {
        state.pendingTaskId = action.meta.arg.taskId
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { todoId, taskId } = action.payload
        const index = state.entities[todoId].findIndex(t => t.id === taskId)

        if (index !== -1) {
          state.entities[todoId].splice(index, 1)
        }
      })
      .addCase(updateTask.pending, (state, action) => {
        state.pendingTaskId = action.meta.arg.taskId
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, todoListId } = action.payload
        const index = state.entities[todoListId].findIndex(t => t.id === id)

        if (index !== -1) {
          state.entities[todoListId][index] = action.payload
        }
      })
      // shared actions
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.forEach(tl => {
          state.entities[tl.id] = []
        })
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.entities[action.payload.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state.entities[action.payload.todoId]
      })
      .addCase(logout.fulfilled, state => {
        state.entities = {}
      })
      // matchers for related actions
      .addMatcher(isPendingAction, state => {
        state.status = 'pending'
      })
      .addMatcher(isFulfilledAction, state => {
        state.status = 'success'
        state.pendingTaskId = null
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.error = action.payload
        state.status = 'failure'
      })
  },
})

// selectors
export const selectTasks = (state: RootState, todoId: string) => state.tasks.entities[todoId]

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
  return selectTasks(state, todoId).find(t => t.id === taskId) as Task
}
export const selectTasksStatus = (state: RootState) => state.tasks.status
export const selectTasksError = (state: RootState) => state.tasks.error
export const selectTaskIsLoading = (state: RootState, taskId: string) => {
  return state.tasks.status === 'pending' && state.tasks.pendingTaskId === taskId
}

export const { resetTasksError } = taskSlice.actions

export default taskSlice.reducer

export type TaskModel = Omit<Task, 'id' | 'todoListId' | 'order' | 'deadline'>
export type TasksMap = Record<string, Task[]>
type TaskState = State<TasksMap> & {
  pendingTaskId: string | null
}
