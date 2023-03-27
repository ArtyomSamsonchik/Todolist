import { RootState, State } from '../../app/store'
import { createSelector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Todolist, todolistAPI } from './todolist-api'
import { createTodolistDomainEntity } from '../../utils/helpers/createTodolistDomainEntity'
import { createAppAsyncThunk } from '../../utils/helpers/createAppAsyncThunk'
import { fetchTasks } from '../Task/task-shared-actions'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { ResultCode } from '../../app/api-instance'
import { basicErrorMessage } from '../../app/app-slice'

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

      return rejectWithValue(message)
    }
  }
)
export const addTodolist = createAppAsyncThunk(
  'todolist/addTodolist',
  async (title: string, { rejectWithValue }) => {
    try {
      const { data } = await todolistAPI.createTodo(title)

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
export const deleteTodolist = createAppAsyncThunk(
  'todolist/deleteTodolist',
  async (todoId: string, { rejectWithValue }) => {
    try {
      const { data } = await todolistAPI.deleteTodo(todoId)

      if (data.resultCode === ResultCode.Ok) {
        return { todoId }
      } else {
        return rejectWithValue(data.messages[0] || basicErrorMessage)
      }
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(message)
    }
  }
)
export const updateTodolistTitle = createAppAsyncThunk(
  'todolist/updateTodolistTitle',
  async (params: { todoId: string; title: string }, { rejectWithValue }) => {
    const { todoId, title } = params

    try {
      const { data } = await todolistAPI.updateTodoTitle(todoId, title)

      if (data.resultCode === ResultCode.Ok) {
        return { todoId, title }
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
const todolistSlice = createSlice({
  name: 'todolist',
  initialState: {
    entities: [],
    status: 'idle',
    error: null,
  } as State<TodolistDomain[]>,
  reducers: {
    updateTodolistFilter(state, action: PayloadAction<{ todoId: string; filter: Filter }>) {
      const { todoId, filter } = action.payload
      const index = state.entities.findIndex(tl => tl.id === todoId)

      if (index !== -1) state.entities[index].filter = filter
    },
    cleanTodolists(state) {
      state.entities = []
    },
    resetTodolistsError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodolists.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      state.entities = action.payload.map(tl => createTodolistDomainEntity(tl))
      state.status = 'success'
    })
    builder.addCase(fetchTodolists.rejected, (state, action) => {
      state.status = 'failure'
      state.error = action.payload
    })

    builder.addCase(addTodolist.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      const newTodolist = createTodolistDomainEntity(action.payload)

      state.entities.unshift(newTodolist)
      state.status = 'success'
    })
    builder.addCase(addTodolist.rejected, (state, action) => {
      state.status = 'failure'
      state.error = action.payload
    })

    builder.addCase(deleteTodolist.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(deleteTodolist.fulfilled, (state, action) => {
      const { todoId } = action.payload
      const index = state.entities.findIndex(tl => tl.id === todoId)

      if (index !== -1) {
        state.entities.splice(index, 1)
        state.status = 'success'
      }
    })
    builder.addCase(deleteTodolist.rejected, (state, action) => {
      state.status = 'failure'
      state.error = action.payload
    })

    builder.addCase(updateTodolistTitle.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(updateTodolistTitle.fulfilled, (state, action) => {
      const { todoId, title } = action.payload
      const index = state.entities.findIndex(tl => tl.id === todoId)

      if (index !== -1) state.entities[index].title = title
      state.status = 'success'
    })
    builder.addCase(updateTodolistTitle.rejected, (state, action) => {
      state.status = 'failure'
      state.error = action.payload
    })
  },
})

// selectors
export const selectAllTodolists = (state: RootState) => state.todolists.entities

export const selectTodolistsStatus = (state: RootState) => state.todolists.status
export const selectTodolistsError = (state: RootState) => state.todolists.error

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

export const { updateTodolistFilter, cleanTodolists, resetTodolistsError } = todolistSlice.actions
export default todolistSlice.reducer

export type Filter = 'active' | 'completed' | 'all'
export type TodolistDomain = Todolist & { filter: Filter }
