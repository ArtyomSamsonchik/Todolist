import { TodolistDomain } from '../../features/Todolist/todolist-slice'
import { Todolist } from '../../features/Todolist/todolist-api'

export const createTodolistDomainEntity = (
  todolist: Todolist,
  options: Pick<TodolistDomain, 'filter'> = { filter: 'all' }
): TodolistDomain => {
  return { ...todolist, tasksIds: [], ...options }
}
