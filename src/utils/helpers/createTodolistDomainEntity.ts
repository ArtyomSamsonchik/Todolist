import { TodolistDomain } from '../../features/Todolist/todolist-slice'
import { Todolist } from '../../features/Todolist/todolist-api'

export const createTodolistDomainEntity = (
  todolist: Todolist,
  options: Partial<Pick<TodolistDomain, 'filter' | 'tasksIds'>> = { filter: 'all', tasksIds: null }
) => ({ ...todolist, ...options } as TodolistDomain)
