import { basicErrorMessage } from '../../app/app-slice'
import { taskAPI } from './task-api'
import { createAppAsyncThunk } from '../../utils/helpers/createAppAsyncThunk'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'

// Put this thunk from tasks-slice into a separate file to prevent circular dependencies,
// since todolist-slice also uses this thunk
export const fetchTasks = createAppAsyncThunk(
  'tasks/fetchTasks',
  async (todoId: string, { rejectWithValue }) => {
    try {
      const { data } = await taskAPI.getTasks(todoId)

      if (!data.error) {
        return { todoId, tasks: data.items }
      } else {
        return rejectWithValue(data.error || basicErrorMessage)
      }
    } catch (e) {
      const message = getThunkErrorMessage(e as Error)

      return rejectWithValue(message)
    }
  }
)
