import { createAppAsyncThunk } from '../../utils/helpers/createAppAsyncThunk'
import { authAPI } from './auth-api'
import { ResultCode } from '../../app/api-instance'
import { selectIsInit } from '../../app/app-slice'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { createAction } from '@reduxjs/toolkit'
import { basicErrorMessage } from '../../app/basic-error-message'

export const initApp = createAction('app/init')

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

      return rejectWithValue(errorMessage || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    } finally {
      dispatch(initApp())
    }
  }
)
