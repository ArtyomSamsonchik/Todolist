import { ResultCode } from '../../app/api-instance'
import { AdapterState, RootState } from '../../app/store'
import { AnyAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Task, taskAPI, TaskStatus } from './task-api'
import { StatusFilter } from '../Todolist/todolist-slice'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { logout } from '../Auth/auth-slice'
import {
  createAppAsyncThunk,
  FulfilledAction,
  isFulfilledAction,
  isPendingAction,
  isRejectedAction,
  PendingAction,
  RejectedAction,
} from '../../app/app-async-thunk'
import { selectTaskIdsByTodolist } from '../Todolist/todolist-shared-selectors'
import { createAppError } from '../../utils/helpers/createAppError'

const isTaskAction = (action: AnyAction) => action.type.startsWith('task')
const isPendingTaskAction = (action: AnyAction): action is PendingAction => {
  return isTaskAction(action) && isPendingAction(action)
}
const isFulfilledTaskAction = (action: AnyAction): action is FulfilledAction => {
  return isTaskAction(action) && isFulfilledAction(action)
}
const isRejectedTaskAction = (action: AnyAction): action is RejectedAction => {
  return isTaskAction(action) && isRejectedAction(action)
}

// thunks
export const fetchTasks = createAppAsyncThunk(
  'tasks/fetchTasks',
  async (todoId: string, { rejectWithValue, getState, requestId }) => {
    const { status, requestId: currentRequestId } = getState().tasks

    if (status !== 'pending' || currentRequestId !== requestId) return

    try {
      const { data } = await taskAPI.getTasks(todoId)

      if (!data.error) return { todoId, tasks: data.items }

      return rejectWithValue(createAppError(data.error))
    } catch (e) {
      const message = getThunkErrorMessage(e)

      return rejectWithValue(createAppError(message))
    }
  }
)

export const addTask = createAppAsyncThunk(
  'task/addTask',
  async (arg: { todoId: string; title: string }, { rejectWithValue }) => {
    try {
      const { todoId, title } = arg
      const { data } = await taskAPI.addTask(todoId, title)
      const [message] = data.messages

      if (data.resultCode === ResultCode.Ok) return { todoId, task: data.data.item }

      return rejectWithValue(createAppError(message, 'validation', { title: message }))
    } catch (e) {
      const message = getThunkErrorMessage(e)

      return rejectWithValue(createAppError(message))
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

      return rejectWithValue(createAppError(data.messages[0]))
    } catch (e) {
      const message = getThunkErrorMessage(e)

      return rejectWithValue(createAppError(message))
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
      // TODO: add typescript 'assertion' control flow helper to avoid type assertion via 'as' keyword
      const task = selectTask(getState(), taskId) as Task
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
      const [message] = data.messages

      if (data.resultCode === ResultCode.Ok) return data.data.item

      return rejectWithValue(createAppError(message, 'validation', { title: message }))
    } catch (e) {
      const message = getThunkErrorMessage(e)

      return rejectWithValue(createAppError(message))
    }
  }
)

const tasksAdapter = createEntityAdapter<Task>()

// slice
const taskSlice = createSlice({
  name: 'task',
  initialState: tasksAdapter.getInitialState<AdapterState & { requestId: string | null }>({
    status: 'idle',
    error: null,
    pendingEntityId: null,
    requestId: null,
  }),
  reducers: {
    resetTasksError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.fulfilled, (state, { payload, meta }) => {
        if (state.status === 'pending' && state.requestId === meta.requestId && payload) {
          const { tasks } = payload

          tasksAdapter.setMany(state, tasks)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { task } = action.payload

        tasksAdapter.addOne(state, task)
      })
      .addCase(deleteTask.pending, (state, action) => {
        state.pendingEntityId = action.meta.arg.taskId
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId } = action.payload

        tasksAdapter.removeOne(state, taskId)
      })
      .addCase(updateTask.pending, (state, action) => {
        state.pendingEntityId = action.meta.arg.taskId
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id } = action.payload

        tasksAdapter.updateOne(state, { id, changes: action.payload })
      })

      // shared actions
      .addCase(logout.fulfilled, state => {
        tasksAdapter.removeAll(state)
      })

      // matchers for related actions
      .addMatcher(isPendingTaskAction, (state, { meta }) => {
        if (state.status !== 'pending') {
          state.status = 'pending'
          state.requestId = meta.requestId
        }
      })
      .addMatcher(isFulfilledTaskAction, (state, { meta }) => {
        if (state.status === 'pending' && state.requestId === meta.requestId) {
          state.status = 'success'
          state.requestId = null
          state.pendingEntityId = null
        }
      })
      .addMatcher(isRejectedTaskAction, (state, { meta, payload }) => {
        if (state.status === 'pending' && state.requestId === meta.requestId) {
          state.status = 'failure'
          state.error = payload
          state.requestId = null
          state.pendingEntityId = null
        }
      })
  },
})

// selectors

export const {
  selectAll: selectAllTasks,
  selectById: selectTask,
  selectEntities: selectTaskEntities,
  selectIds,
} = tasksAdapter.getSelectors<RootState>(state => state.tasks)

// Use this factory inside useMemo in Todolist component to provide every Todolist
// instance his own selector.
export const filteredTasksSelectorFactory = () => {
  const selectTasksByTodolist = createSelector(
    (state: RootState) => selectTaskEntities(state),
    selectTaskIdsByTodolist,
    (tasksDict, taskIds) => taskIds.map(id => tasksDict[id] as Task),
    {
      memoizeOptions: { resultEqualityCheck: shallowEqual },
    }
  )

  const selectFilteredTasks = createSelector(
    selectTasksByTodolist,
    (state: RootState, todoId: string, filter: StatusFilter) => filter,
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

  const selectFilteredTaskIds = createSelector(
    selectFilteredTasks,
    tasks => tasks?.map(t => t.id),
    {
      memoizeOptions: { resultEqualityCheck: shallowEqual },
    }
  )

  return { selectTasksByTodolist, selectFilteredTasks, selectFilteredTaskIds }
}

export const selectTasksStatus = (state: RootState) => state.tasks.status
export const selectTasksError = (state: RootState) => state.tasks.error
export const selectTaskIsLoading = (state: RootState, taskId: string) => {
  return state.tasks.status === 'pending' && state.tasks.pendingEntityId === taskId
}

export const { resetTasksError } = taskSlice.actions

export default taskSlice.reducer

export type TaskModel = Omit<Task, 'id' | 'todoListId' | 'order' | 'deadline'>
