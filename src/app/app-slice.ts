import { RootState } from './store'
import { createSlice } from '@reduxjs/toolkit'

export const basicErrorMessage = 'Something went wrong! Check your Internet connection'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isInitialized: false,
  },
  reducers: {
    initApp(state) {
      state.isInitialized = true
    },
  },
})

// selectors
export const selectIsInit = (state: RootState) => state.app.isInitialized

export const { initApp } = appSlice.actions

export default appSlice.reducer
