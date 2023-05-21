import { RootState } from '../../app/store'
import { selectTodolist } from './todolist-slice'

export const selectTaskIdsByTodolist = (state: RootState, todoId: string) => {
  return selectTodolist(state, todoId)?.tasksIds
}
