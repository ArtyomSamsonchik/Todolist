import { RequestStatus, RootState } from './store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  status: 'idle' as RequestStatus,
  error: null as string | null,
  isInitialized: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initApp(state) {
      state.isInitialized = true
    },
    setAppStatus(state, action: PayloadAction<RequestStatus>) {
      state.status = action.payload
    },
    setAppError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

// selectors
export const selectAppStatus = (state: RootState) => state.app.status
export const selectAppError = (state: RootState) => state.app.error
export const selectIsInit = (state: RootState) => state.app.isInitialized

export const { initApp, setAppStatus, setAppError } = appSlice.actions
export default appSlice.reducer
