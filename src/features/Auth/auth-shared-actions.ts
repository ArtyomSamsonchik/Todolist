import { createAppAsyncThunk } from '../../app/app-async-thunk'
import { authAPI } from './auth-api'
import { ResultCode } from '../../app/api-instance'
import { initApp, selectIsInit } from '../../app/app-slice'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { createAppError } from '../../utils/helpers/createAppError'

export const authMe = createAppAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await authAPI.me()

      if (data.resultCode === ResultCode.Ok) return { isAuthorized: true }

      const isInitialized = selectIsInit(getState()),
        errorMessage = data.messages[0],
        notAuthorizedOnFirstLoad = errorMessage === 'You are not authorized' && !isInitialized

      if (notAuthorizedOnFirstLoad) return { isAuthorized: false }

      return rejectWithValue(createAppError(errorMessage))
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(createAppError(message))
    } finally {
      dispatch(initApp())
    }
  }
)
