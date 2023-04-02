import { AnyAction, AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from './store'

export type AppAsyncThunkConfig = {
  state: RootState
  dispatch: AppDispatch
  rejectValue: string
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, AppAsyncThunkConfig>
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export const isPendingAction = (action: AnyAction): action is PendingAction => {
  return action.type.endsWith('/pending')
}

export const isRejectedAction = (action: AnyAction): action is RejectedAction => {
  return action.type.endsWith('/rejected')
}

export const isFulfilledAction = (action: AnyAction): action is FulfilledAction => {
  return action.type.endsWith('/fulfilled')
}

export const createAppAsyncThunk = createAsyncThunk.withTypes<AppAsyncThunkConfig>()
