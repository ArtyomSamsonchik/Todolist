import {TaskModel} from "./task-slice";
import {ApiResponse, instance} from "../../app/api-instance";

export const taskAPI = {
    getTasks(todoId: string) {
        return instance.get<
            { items: Task[], totalCount: number, error: string }
        >(`todo-lists/${todoId}/tasks`)
    },
    addTask(todoId: string, title: string) {
        return instance.post<ApiResponse<{ item: Task }>>(`todo-lists/${todoId}/tasks`, {title})
    },
    deleteTask(todoId: string, taskId: string) {
        return instance.delete<ApiResponse>(`todo-lists/${todoId}/tasks/${taskId}`)
    },
    updateTask(todoId: string, taskId: string, model: TaskModel) {
        return instance.put<ApiResponse<{ item: Task }>>(`todo-lists/${todoId}/tasks/${taskId}`, model)
    }
}

export type Task = {
    description: string
    title: string
    status: TaskStatus
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatus {
    Uncompleted,
    Completed
}
