import { RootState, State } from '../../app/store'
import { ResultCode } from '../../app/api-instance'
import { createSlice } from '@reduxjs/toolkit'
import { authAPI, LoginData } from './auth-api'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { authMe } from './auth-shared-actions'
import { basicErrorMessage } from '../../app/basic-error-message'
import { createAppAsyncThunk } from '../../app/app-async-thunk'

// thunks
export const login = createAppAsyncThunk(
  'auth/login',
  async (arg: LoginData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.login(arg)

      if (data.resultCode === ResultCode.Ok) return { userId: data.data.userId }

      return rejectWithValue(data.messages[0] || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)

export const logout = createAppAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.logout()

    if (data.resultCode === ResultCode.Ok) return

    return rejectWithValue(data.messages[0] || basicErrorMessage)
  } catch (e) {
    return rejectWithValue(getThunkErrorMessage(e as Error))
  }
})

const initialState: State & { isLoggedIn: boolean } = {
  status: 'idle',
  error: null,
  entities: undefined,
  isLoggedIn: false,
}

// slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(login.fulfilled, state => {
      state.isLoggedIn = true
      state.status = 'success'
    })
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })

    builder.addCase(logout.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(logout.fulfilled, state => {
      state.isLoggedIn = false
      state.status = 'success'
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })

    builder.addCase(authMe.pending, state => {
      state.status = 'pending'
    })
    builder.addCase(authMe.fulfilled, (state, action) => {
      if (action.payload.isAuthorized) state.isLoggedIn = true
      state.status = 'success'
    })
    builder.addCase(authMe.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failure'
    })
  },
})

// selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error

export const { resetAuthError } = authSlice.actions

export default authSlice.reducer
