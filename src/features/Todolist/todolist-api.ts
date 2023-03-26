import { ApiResponse, instance } from '../../app/api-instance'

export const todolistAPI = {
  getTodos() {
    return instance.get<Todolist[]>('todo-lists')
  },
  createTodo(title: string) {
    return instance.post<ApiResponse<{ item: Todolist }>>('todo-lists', { title })
  },
  deleteTodo(todoId: string) {
    return instance.delete<ApiResponse>(`todo-lists/${todoId}`)
  },
  updateTodoTitle(todoId: string, title: string) {
    return instance.put<ApiResponse>(`todo-lists/${todoId}`, { title })
  },
}

export type Todolist = {
  id: string
  addedDate: string
  order: number
  title: string
}
