import { AdapterState, RootState } from '../../app/store'
import { ResultCode } from '../../app/api-instance'
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI, LoginData } from './auth-api'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { authMe } from './auth-shared-actions'
import {
  createAppAsyncThunk,
  FulfilledAction,
  isFulfilledAction,
  isPendingAction,
  isRejectedAction,
  PendingAction,
  RejectedAction,
} from '../../app/app-async-thunk'
import { createAppError } from '../../utils/helpers/createAppError'

const isAuthAction = (action: AnyAction) => action.type.startsWith('auth')
const isPendingAuthAction = (action: AnyAction): action is PendingAction => {
  return isAuthAction(action) && isPendingAction(action)
}
const isFulfilledAuthAction = (action: AnyAction): action is FulfilledAction => {
  return isAuthAction(action) && isFulfilledAction(action)
}
const isRejectedAuthAction = (action: AnyAction): action is RejectedAction => {
  return isAuthAction(action) && isRejectedAction(action)
}

// thunks
export const login = createAppAsyncThunk(
  'auth/login',
  async (arg: LoginData, { rejectWithValue, dispatch, getState }) => {
    try {
      const { data } = await authAPI.login(arg)
      let message = data.messages[0]

      if (data.resultCode === ResultCode.Ok) return { userId: data.data.userId, email: arg.email }

      if (data.resultCode === ResultCode.CaptchaIsRequired) {
        const { data: captcha } = await authAPI.getCaptcha()

        // Set this message on the first attempt to log in if captcha is required.
        if (!selectCaptchaUrl(getState())) {
          message = 'Validation failed. Please, enter the text from the captcha image'
        }

        dispatch(setCaptchaUrl(captcha.url))
      }

      return rejectWithValue(createAppError(message))
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(createAppError(message))
    }
  }
)

export const logout = createAppAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.logout()

    if (data.resultCode === ResultCode.Ok) return

    return rejectWithValue(createAppError(data.messages[0]))
  } catch (e) {
    const message = getThunkErrorMessage(e as Error)

    return rejectWithValue(createAppError(message))
  }
})

const initialState: Pick<AdapterState, 'error' | 'status'> & {
  isLoggedIn: boolean
  email: string | null
  captchaUrl: string | null
} = {
  status: 'idle',
  error: null,
  isLoggedIn: false,
  email: null,
  captchaUrl: null,
}

// slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError(state) {
      state.error = null
    },
    setCaptchaUrl(state, action: PayloadAction<string>) {
      state.captchaUrl = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // TODO: add initLoading state prop to remove 'not auth' error on init
        state.isLoggedIn = true
        state.email = action.payload.email
        state.captchaUrl = null
      })
      .addCase(logout.fulfilled, state => {
        state.isLoggedIn = false
        state.email = null
      })
      .addCase(authMe.fulfilled, (state, action) => {
        const { email, isLoggedIn } = action.payload
        state.isLoggedIn = isLoggedIn
        state.email = email
      })

      // matchers for related actions
      .addMatcher(isPendingAuthAction, state => {
        state.status = 'pending'
      })
      .addMatcher(isFulfilledAuthAction, state => {
        state.status = 'success'
      })
      .addMatcher(isRejectedAuthAction, (state, action) => {
        state.status = 'failure'
        state.error = action.payload
      })
  },
})

// selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error
export const selectUserEmail = (state: RootState) => state.auth.email
export const selectCaptchaUrl = (state: RootState) => state.auth.captchaUrl

export const { resetAuthError, setCaptchaUrl } = authSlice.actions

export default authSlice.reducer
