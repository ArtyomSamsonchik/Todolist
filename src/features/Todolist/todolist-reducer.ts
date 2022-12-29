import {ResultCode, todolistAPI, TodolistType} from "../../app/api";
import {AppThunk, RootStateType} from "../../app/store";
import {RequestStatusType, setAppStatus} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleError} from "../../common/utils/handleErrors";


const todolistReducer = (state: TodolistDomainType[] = [], action: TodolistActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "todolist/initTodolists":
            return action.todos.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        case "todolist/addTodolist":
            return [{...action.todo, filter: "all", entityStatus: "idle"}, ...state]
        case "todolist/removeTodolist":
            return state.filter(tl => tl.id !== action.todoId)
        case "todolist/updateTodolist":
            return state.map(tl => tl.id === action.todoId
                ? {...tl, ...action.config}
                : tl
            )
        case "todolist/setTodolistStatus":
            return state.map(tl => tl.id === action.todoId
                ? {...tl, entityStatus: action.status}
                : tl
            )
        case "todolist/cleanTodolists":
            return []
        default:
            return state
    }
}

export const initTodolists = (todos: TodolistType[]) => ({
    type: "todolist/initTodolists",
    todos
}) as const

export const addTodolist = (todo: TodolistType) => ({
    type: "todolist/addTodolist",
    todo
}) as const

export const removeTodolist = (todoId: string) => ({
    type: "todolist/removeTodolist",
    todoId
}) as const

export const updateTodolist = (todoId: string, config: TodolistConfigType) => ({
    type: "todolist/updateTodolist",
    todoId,
    config
}) as const

export const cleanTodolists = () => ({
    type: "todolist/cleanTodolists"
}) as const

export const setTodolistStatus = (todoId: string, status: RequestStatusType) => ({
    type: "todolist/setTodolistStatus",
    todoId,
    status
}) as const

export const fetchTodolistsTC = (): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    todolistAPI.getTodos()
        .then(({data}) => {
            dispatch(initTodolists(data))
            dispatch(setAppStatus("success"))
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
        })
}

export const addTodolistTC = (title: string): AppThunk<Promise<void>> => dispatch => {
    dispatch(setAppStatus("loading"))

    return todolistAPI.createTodo(title)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(addTodolist(data.data.item))
                dispatch(setAppStatus("success"))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
        })
}

export const deleteTodolistTC = (todoId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    dispatch(setTodolistStatus(todoId, "loading"))
    todolistAPI.deleteTodo(todoId)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(removeTodolist(todoId))
                dispatch(setAppStatus("success"))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
            dispatch(setTodolistStatus(todoId, "failure"))
        })
}

export const updateTodolistTitleTC = (todoId: string, title: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    dispatch(setTodolistStatus(todoId, "loading"))
    todolistAPI.updateTodoTitle(todoId, title)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(updateTodolist(todoId, {title}))
                dispatch(setAppStatus("success"))
                dispatch(setTodolistStatus(todoId, "success"))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
            dispatch(setTodolistStatus(todoId, "failure"))
        })
}

export const selectAllTodolists = (state: RootStateType) => state.todolists
export const selectTodolistIds = (state: RootStateType) => {
    return selectAllTodolists(state).map(tl => tl.id)
}
export const selectTodolist = (todoId: string) => (state: RootStateType) => {
    return selectAllTodolists(state).find(tl => tl.id === todoId) as TodolistDomainType
}

export default todolistReducer


export type FilterType = "active" | "completed" | "all"
export type TodolistDomainType = {
    filter: FilterType
    entityStatus: RequestStatusType
} & TodolistType
type TodolistConfigType = Partial<Pick<TodolistDomainType, "title" | "filter">>

export type InitTodolistsAT = ReturnType<typeof initTodolists>
export type AddTodolistAT = ReturnType<typeof addTodolist>
export type RemoveTodolistAT = ReturnType<typeof removeTodolist>
export type updateTodolistAT = ReturnType<typeof updateTodolist>
export type cleanTodolistsAT = ReturnType<typeof cleanTodolists>
export type setTodolistStatusAT = ReturnType<typeof setTodolistStatus>

export type TodolistActionsType =
    InitTodolistsAT
    | AddTodolistAT
    | RemoveTodolistAT
    | cleanTodolistsAT
    | updateTodolistAT
    | setTodolistStatusAT