import {ResultCode} from "../../app/api-instance";
import {AppThunk, RootStateType} from "../../app/store";
import {RequestStatus, setAppStatus} from "../../app/app-slice";
import {AxiosError} from "axios";
import {handleError} from "../../utils/helpers/handleErrors";
import {createSelector} from "reselect";
import {shallowEqual} from "react-redux";
import {fetchTasksTC} from "../Task/task-slice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Todolist, todolistAPI} from "./todolist-api";

const todolistSlice = createSlice({
    name: 'todolist',
    initialState: [] as TodolistDomain[],
    reducers: {
        initTodolists(state, action: PayloadAction<Todolist[]>) {
            return action.payload.map<TodolistDomain>(
                tl => ({...tl, filter: 'all', entityStatus: 'idle'})
            )
        },
        addTodolist(state, action: PayloadAction<Todolist>) {
            const newTodolist: TodolistDomain = {
                ...action.payload,
                filter: 'all',
                entityStatus: 'idle'
            }

            state.unshift(newTodolist)
        },
        removeTodolist(state, action: PayloadAction<{ todoId: string }>) {
            return state.filter(tl => tl.id !== action.payload.todoId)
        },
        updateTodolist(state, action: PayloadAction<{ todoId: string, patch: TodolistPatch }>) {
            const {todoId, patch} = action.payload
            const index = state.findIndex(tl => tl.id === todoId)

            if (index > -1) state[index] = {...state[index], ...patch}
        },
        cleanTodolists() {
            return []
        },
        setTodolistStatus(
            state,
            action: PayloadAction<{ todoId: string, status: TodolistRequestStatus }>
        ) {
            let todolist = state.find(tl => tl.id === action.payload.todoId)

            if (todolist) todolist.entityStatus = action.payload.status
        }
    }
})

// thunks
export const fetchTodolistsTC = (): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    todolistAPI.getTodos()
        .then(({data}) => {
            dispatch(initTodolists(data))
            dispatch(setAppStatus("success"))
            return data
        })
        .then((todos) => {
            todos.forEach(tl => dispatch(fetchTasksTC(tl.id)))
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
    dispatch(setTodolistStatus({todoId, status: "deleting"}))
    todolistAPI.deleteTodo(todoId)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(removeTodolist({todoId}))
                dispatch(setAppStatus("success"))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
            dispatch(setTodolistStatus({todoId, status: "failure"}))
        })
}

export const updateTodolistTitleTC = (todoId: string, title: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    dispatch(setTodolistStatus({todoId, status: "loading"}))
    todolistAPI.updateTodoTitle(todoId, title)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(updateTodolist({
                    todoId,
                    patch: {title}
                }))
                dispatch(setAppStatus("success"))
                dispatch(setTodolistStatus({todoId, status: "success"}))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
            dispatch(setTodolistStatus({todoId, status: "failure"}))
        })
}

// selectors
export const selectAllTodolists = (state: RootStateType) => state.todolists

export const selectTodolistIds = createSelector(
    selectAllTodolists,
    todolists => todolists.map(tl => tl.id),
    {
        memoizeOptions: {resultEqualityCheck: shallowEqual}
    }
)

export const selectTodolist = (state: RootStateType, todoId: string) => {
    return selectAllTodolists(state).find(tl => tl.id === todoId) as TodolistDomain
}

export const {
    initTodolists,
    addTodolist,
    removeTodolist,
    updateTodolist,
    setTodolistStatus,
    cleanTodolists
} = todolistSlice.actions
export default todolistSlice.reducer

export type TodolistRequestStatus = RequestStatus | "deleting" | "fetchingTasks"
export type Filter = "active" | "completed" | "all"
export type TodolistDomain = Todolist & {
    filter: Filter
    entityStatus: TodolistRequestStatus
}
type TodolistPatch = Partial<Pick<TodolistDomain, "title" | "filter">>