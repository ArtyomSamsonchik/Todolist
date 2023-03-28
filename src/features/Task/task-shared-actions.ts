import { taskAPI } from './task-api'
import { createAppAsyncThunk } from '../../utils/helpers/createAppAsyncThunk'
import { getThunkErrorMessage } from '../../utils/helpers/getThunkErrorMessage'
import { basicErrorMessage } from '../../app/basic-error-message'

// Put this thunk from tasks-slice into a separate file to prevent circular dependencies,
// since todolist-slice also uses this thunk
export const fetchTasks = createAppAsyncThunk(
  'tasks/fetchTasks',
  async (todoId: string, { rejectWithValue }) => {
    try {
      const { data } = await taskAPI.getTasks(todoId)

      if (!data.error) return { todoId, tasks: data.items }

      return rejectWithValue(data.error || basicErrorMessage)
    } catch (e) {
      return rejectWithValue(getThunkErrorMessage(e as Error))
    }
  }
)
