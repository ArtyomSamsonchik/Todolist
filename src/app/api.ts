import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.1",
    headers: {
        "API-KEY": "3a0fd058-a035-41ce-a05e-8b1d5cd36226"
    }
})

export const todolistAPI = {
    getTodos() {
        return instance.get<TodolistType[]>("todo-lists")
    },
    createTodo(title: string) {
        return instance.post<ApiResponse<{ item: TodolistType }>>("todo-lists", {title})
    },
    deleteTodo(todoId: string) {
        return instance.delete<ApiResponse>(`todo-lists/${todoId}`)
    },
    updateTodoTitle(todoId: string, title: string) {
        return instance.put<ApiResponse>(`todo-lists/${todoId}`, {title})
    }
}

export const taskAPI = {
    getTasks(todoId: string) {
        return instance.get<
            { items: TaskType[], totalCount: number, error: string }
        >(`todo-lists/${todoId}/tasks`)
    },
    addTask(todoId: string, title: string) {
        return instance.post<ApiResponse<{ item: TaskType }>>(`todo-lists/${todoId}/tasks`, {title})
    },
    deleteTask(todoId: string, taskId: string) {
        return instance.delete<ApiResponse>(`todo-lists/${todoId}/tasks/${taskId}`)
    },
    updateTask(todoId: string, taskId: string, model: TaskModelType) {
        return instance.put<ApiResponse<{ item: TaskType }>>(`todo-lists/${todoId}/tasks/${taskId}`, model)
    }
}

export const authAPI = {
    login(config: LoginConfigType) {
        return instance.post<ApiResponse<{ userId: number }>>("auth/login", config)
    },
    logout() {
        return instance.delete<ApiResponse>("auth/login")
    },
    me() {
        return instance.get<ApiResponse<AuthUserData>>("auth/me")
    }
}

type ApiResponse<T = {}> = {
    resultCode: ResultCode
    messages: string[]
    data: T
}

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type TaskType = {
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

export type TaskModelType = Omit<TaskType, "id" | "todoListId" | "order" | "deadline">

export enum ResultCode {
    Ok,
    Error,
    CaptchaIsRequired = 10
}

export enum TaskStatus {
    Uncompleted,
    Completed
}

export type LoginConfigType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type AuthUserData = {
    id: number
    email: string
    login: string
}