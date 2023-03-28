import { RootState } from './store'
import { createSlice } from '@reduxjs/toolkit'
import { initApp } from '../features/Auth/auth-shared-actions'

// slice
const appSlice = createSlice({
  name: 'app',
  initialState: {
    isInitialized: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(initApp, state => {
      state.isInitialized = true
    })
  },
})

// selectors
export const selectIsInit = (state: RootState) => state.app.isInitialized

export default appSlice.reducer
