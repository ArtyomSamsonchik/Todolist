import { createAppAsyncThunk } from '../../app/app-async-thunk'
import { authAPI } from './auth-api'
import { ResultCode } from '../../app/api-instance'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { createAppError } from '../../utils/helpers/createAppError'

export const authMe = createAppAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.me()

    if (data.resultCode === ResultCode.Ok) return { isLoggedIn: true, email: data.data.email }

    // const { status, isLoggedIn } = getState().auth
    // const didNotInitialized = status === 'idle' && isLoggedIn === false,
    //   errorMessage = data.messages[0],
    //   notAuthorizedOnFirstLoad = errorMessage === 'You are not authorized' && didNotInitialized

    // if (notAuthorizedOnFirstLoad) return { isAuthorized: false }

    // return rejectWithValue(createAppError(errorMessage))
    return { isLoggedIn: false, email: null }
  } catch (e) {
    const message = getThunkErrorMessage(e as Error)

    return rejectWithValue(createAppError(message))
  }
})
