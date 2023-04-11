import { RootState, State } from '../../app/store'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
import { fetchTasks } from '../Task/task-shared-actions'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { ResultCode } from '../../app/api-instance'
import { basicErrorMessage } from '../../app/basic-error-message'
import { logout } from '../Auth/auth-slice'

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
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)
export const addTodolist = createAppAsyncThunk(
  'todolist/addTodolist',
  async (title: string, { rejectWithValue }) => {
    try {
      const { data } = await todolistAPI.createTodo(title)

      if (data.resultCode === ResultCode.Ok) return data.data.item

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)
export const deleteTodolist = createAppAsyncThunk(
  'todolist/deleteTodolist',
  async (todoId: string, { rejectWithValue }) => {
    try {
      const { data } = await todolistAPI.deleteTodo(todoId)

      if (data.resultCode === ResultCode.Ok) return { todoId }

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
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

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)

// slice
const todolistSlice = createSlice({
  name: 'todolist',
  initialState: {
    entities: [],
    status: 'idle',
    error: null,
    pendingEntityId: null,
  } as State<TodolistDomain[]>,
  reducers: {
    updateTodolistFilter(state, action: PayloadAction<{ todoId: string; filter: Filter }>) {
      const { todoId, filter } = action.payload
      const index = state.entities.findIndex(tl => tl.id === todoId)

      if (index !== -1) state.entities[index].filter = filter
    },
    resetTodolistsError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        state.entities = action.payload.map(tl => createTodolistDomainEntity(tl))
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodolist = createTodolistDomainEntity(action.payload)

        state.entities.unshift(newTodolist)
      })
      .addCase(deleteTodolist.pending, (state, action) => {
        state.pendingEntityId = action.meta.arg
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        const { todoId } = action.payload
        const index = state.entities.findIndex(tl => tl.id === todoId)

        if (index !== -1) {
          state.entities.splice(index, 1)
        }
      })
      .addCase(updateTodolistTitle.pending, (state, action) => {
        state.pendingEntityId = action.meta.arg.todoId
      })
      .addCase(updateTodolistTitle.fulfilled, (state, action) => {
        const { todoId, title } = action.payload
        const index = state.entities.findIndex(tl => tl.id === todoId)

        if (index !== -1) state.entities[index].title = title
      })

      // shared actions
      .addCase(logout.fulfilled, state => {
        state.entities = []
      })

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
export const selectAllTodolists = (state: RootState) => state.todolists.entities

export const selectTodolistsStatus = (state: RootState) => state.todolists.status
export const selectTodolistsError = (state: RootState) => state.todolists.error
export const selectTodolistIsLoading = (state: RootState, todoId: string) => {
  return state.todolists.status === 'pending' && state.todolists.pendingEntityId === todoId
}

export const selectTodolistIds = createSelector(
  selectAllTodolists,
  todolists => todolists.map(tl => tl.id),
  {
    memoizeOptions: { resultEqualityCheck: shallowEqual },
  }
)

export const selectTodolist = (state: RootState, todoId: string) => {
  return selectAllTodolists(state).find(tl => tl.id === todoId) as TodolistDomain
}

export const { updateTodolistFilter, resetTodolistsError } = todolistSlice.actions

export default todolistSlice.reducer

export type Filter = 'active' | 'completed' | 'all'
export type TodolistDomain = Todolist & { filter: Filter }
