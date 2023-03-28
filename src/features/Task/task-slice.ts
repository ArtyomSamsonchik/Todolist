import { ResultCode } from '../../app/api-instance'
import { RootState, State } from '../../app/store'
import { createSlice } from '@reduxjs/toolkit'
import { Task, taskAPI, TaskStatus } from './task-api'
import { fetchTasks } from './task-shared-actions'
import { addTodolist, deleteTodolist, fetchTodolists, Filter } from '../Todolist/todolist-slice'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { createAppAsyncThunk } from '../../utils/helpers/createAppAsyncThunk'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { basicErrorMessage } from '../../app/basic-error-message'
import { logout } from '../Auth/auth-slice'

// thunks
export const addTask = createAppAsyncThunk(
  'task/addTask',
  async (arg: { todoId: string; title: string }, { rejectWithValue }) => {
    try {
      const { todoId, title } = arg
      const { data } = await taskAPI.addTask(todoId, title)

      if (data.resultCode === ResultCode.Ok) {
        return { todoId, task: data.data.item }
      } else {
        return rejectWithValue(data.messages[0] || basicErrorMessage)
      }
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(message)
    }
  }
)

export const deleteTask = createAppAsyncThunk(
  'task/deleteTask',
  async (arg: { todoId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const { todoId, taskId } = arg
      const { data } = await taskAPI.deleteTask(todoId, taskId)

      if (data.resultCode === ResultCode.Ok) {
        return { todoId, taskId }
      } else {
        return rejectWithValue(data.messages[0] || basicErrorMessage)
      }
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(message)
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

      if (data.resultCode === ResultCode.Ok) {
        return data.data.item
      } else {
        return rejectWithValue(data.messages[0] || basicErrorMessage)
      }
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(message)
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
  } as State<TasksState>,
  reducers: {
    resetTasksError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTasks.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      const { todoId, tasks } = action.payload

      state.entities[todoId] = tasks
      state.status = 'success'
    })
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })

    builder.addCase(addTask.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(addTask.fulfilled, (state, action) => {
      const { todoId, task } = action.payload

      state.entities[todoId].unshift(task)
      state.status = 'success'
    })
    builder.addCase(addTask.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })

    builder.addCase(deleteTask.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const { todoId, taskId } = action.payload
      const index = state.entities[todoId].findIndex(t => t.id === taskId)

      if (index !== -1) {
        state.entities[todoId].splice(index, 1)
        state.status = 'success'
      }
    })
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })

    builder.addCase(updateTask.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const { id, todoListId } = action.payload
      const index = state.entities[todoListId].findIndex(t => t.id === id)

      if (index !== -1) {
        state.entities[todoListId][index] = action.payload
        state.status = 'success'
      }
    })
    builder.addCase(updateTask.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })

    // shared actions
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      action.payload.forEach(tl => {
        state.entities[tl.id] = []
      })
    })
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.entities[action.payload.id] = []
    })
    builder.addCase(deleteTodolist.fulfilled, (state, action) => {
      delete state.entities[action.payload.todoId]
    })
    builder.addCase(logout.fulfilled, state => {
      state.entities = {}
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

export const { resetTasksError } = taskSlice.actions

export default taskSlice.reducer

export type TaskModel = Omit<Task, 'id' | 'todoListId' | 'order' | 'deadline'>
export type TasksState = Record<string, Task[]>
