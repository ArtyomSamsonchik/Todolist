import { AdapterState, RootState } from '../../app/store'
import { AnyAction, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Todolist, todolistAPI } from './todolist-api'
import { createTodolistDomainEntity } from '../../utils/helpers/createTodolistDomainEntity'
import {
  createAppAsyncThunk,
  FulfilledAction,
  isFulfilledAction,
  isPendingAction,
  isRejectedAction,
  PendingAction,
  RejectedAction,
} from '../../app/app-async-thunk'
import { addTask, deleteTask, fetchTasks } from '../Task/task-slice'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { ResultCode } from '../../app/api-instance'
import { logout } from '../Auth/auth-slice'
import { createAppError } from '../../utils/helpers/createAppError'

const isTodolistAction = (action: AnyAction) => action.type.startsWith('todolist')
const isPendingTodolistAction = (action: AnyAction): action is PendingAction => {
  return isTodolistAction(action) && isPendingAction(action)
}
const isFulfilledTodolistAction = (action: AnyAction): action is FulfilledAction => {
  return isTodolistAction(action) && isFulfilledAction(action)
}
const isRejectedTodolistAction = (action: AnyAction): action is RejectedAction => {
  return isTodolistAction(action) && isRejectedAction(action)
}

// thunks
export const fetchTodolists = createAppAsyncThunk(
  'todolist/fetchTodolists',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data: todolists } = await todolistAPI.getTodos()

      todolists.forEach(tl => dispatch(fetchTasks(tl.id)))

      return todolists
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(createAppError(message))
    }
  }
)
export const addTodolist = createAppAsyncThunk(
  'todolist/addTodolist',
  async (title: string, { rejectWithValue }) => {
    try {
      const { data } = await todolistAPI.createTodo(title)

      if (data.resultCode === ResultCode.Ok) return data.data.item

      return rejectWithValue(
        createAppError(data.messages[0], data.fieldsErrors ? 'validation' : 'global')
      )
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(createAppError(message))
    }
  }
)
export const deleteTodolist = createAppAsyncThunk(
  'todolist/deleteTodolist',
  async (todoId: string, { rejectWithValue }) => {
    try {
      const { data } = await todolistAPI.deleteTodo(todoId)

      if (data.resultCode === ResultCode.Ok) return todoId

      return rejectWithValue(createAppError(data.messages[0]))
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(createAppError(message))
    }
  }
)
export const updateTodolistTitle = createAppAsyncThunk(
  'todolist/updateTodolistTitle',
  async (params: { todoId: string; title: string }, { rejectWithValue }) => {
    const { todoId, title } = params

    try {
      const { data } = await todolistAPI.updateTodoTitle(todoId, title)

      if (data.resultCode === ResultCode.Ok) return { todoId, title }

      return rejectWithValue(
        createAppError(data.messages[0], data.fieldsErrors ? 'validation' : 'global')
      )
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(createAppError(message))
    }
  }
)

const todolistsAdapter = createEntityAdapter<TodolistDomain>({
  sortComparer: (a, b) => {
    if (a.order > b.order) return 1
    if (a.order === b.order) return 0

    return -1
  },
})

// slice
const todolistSlice = createSlice({
  name: 'todolist',
  initialState: todolistsAdapter.getInitialState<AdapterState>({
    error: null,
    status: 'idle',
    pendingEntityId: null,
  }),
  reducers: {
    updateTodolistFilter(state, action: PayloadAction<{ todoId: string; filter: StatusFilter }>) {
      const { todoId, filter } = action.payload

      todolistsAdapter.updateOne(state, { id: todoId, changes: { filter } })
    },
    resetTodolistsError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        const mappedEntities = action.payload.map(tl => createTodolistDomainEntity(tl))

        todolistsAdapter.setMany(state, mappedEntities)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodolist = createTodolistDomainEntity(action.payload)

        todolistsAdapter.addOne(state, newTodolist)
      })
      .addCase(deleteTodolist.pending, (state, action) => {
        state.pendingEntityId = action.meta.arg
      })
      .addCase(deleteTodolist.fulfilled, todolistsAdapter.removeOne)
      .addCase(updateTodolistTitle.pending, (state, action) => {
        state.pendingEntityId = action.meta.arg.todoId
      })
      .addCase(updateTodolistTitle.fulfilled, (state, action) => {
        const { todoId, title } = action.payload

        todolistsAdapter.updateOne(state, { id: todoId, changes: { title } })
      })

      // shared actions
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const { todoId, tasks } = action.payload
        const todolist = state.entities[todoId]

        if (todolist) todolist.tasksIds = tasks.map(t => t.id)
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { todoId, task } = action.payload
        const todolist = state.entities[todoId]

        if (todolist) todolist.tasksIds.unshift(task.id)
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { todoId, taskId } = action.payload
        const todolist = state.entities[todoId]

        if (!todolist) return

        const index = todolist.tasksIds.findIndex(id => id === taskId)

        if (index !== -1) todolist?.tasksIds.splice(index, 1)
      })
      .addCase(logout.fulfilled, todolistsAdapter.removeAll)

      // matchers for related actions
      .addMatcher(isPendingTodolistAction, state => {
        state.status = 'pending'
      })
      .addMatcher(isFulfilledTodolistAction, (state, { meta }) => {
        state.status = 'success'
        state.pendingEntityId = null
      })
      .addMatcher(isRejectedTodolistAction, (state, action) => {
        state.status = 'failure'
        state.error = action.payload
      })
  },
})

// selectors
export const {
  selectAll: selectAllTodolists,
  selectById: selectTodolist,
  selectIds: selectTodolistIds,
} = todolistsAdapter.getSelectors<RootState>(state => state.todolists)

export const selectTodolistsStatus = (state: RootState) => state.todolists.status
export const selectTodolistsError = (state: RootState) => state.todolists.error
export const selectTodolistIsLoading = (state: RootState, todoId: string) => {
  return state.todolists.status === 'pending' && state.todolists.pendingEntityId === todoId
}

export const { updateTodolistFilter, resetTodolistsError } = todolistSlice.actions

export default todolistSlice.reducer

export type StatusFilter = 'active' | 'completed' | 'all'
export type TodolistDomain = Todolist & { filter: StatusFilter; tasksIds: string[] }
