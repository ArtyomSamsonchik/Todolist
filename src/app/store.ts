import todolistReducer from '../features/Todolist/todolist-slice'
import taskReducer from '../features/Task/task-slice'
import authReducer from '../features/Auth/auth-slice'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    todolists: todolistReducer,
    tasks: taskReducer,
    auth: authReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AdapterState = {
  status: RequestStatus
  error: AppError | null | undefined
  pendingEntityId: string | null
}

export type AppError =
  | { scope: 'global'; message: string }
  | {
      scope: 'validation'
      message: string
      fields: Record<string, string>
    }

export type RequestStatus = 'idle' | 'pending' | 'success' | 'failure'

if (process.env.NODE_ENV === 'development') {
  //@ts-ignore
  window.store = store
}
