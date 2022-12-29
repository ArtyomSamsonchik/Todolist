import {ResultCode, taskAPI, TaskModelType, TaskStatus, TaskType} from "../../app/api";
import {AddTodolistAT, FilterType, InitTodolistsAT} from "../Todolist/todolist-reducer";
import {AppThunk, RootStateType} from "../../app/store";
import {RequestStatusType, setAppStatus} from "../../app/app-reducer";
import {handleError} from "../../common/utils/handleErrors";
import {AxiosError} from "axios";

const taskReducer = (state: TasksStateType = {}, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "todolist/initTodolists": {
            action.todos.forEach(tl => state[tl.id] = [])
            return state
        }
        case "tasks/initTasks":
            return {...state, [action.todoId]: action.tasks.map(t => ({...t, entityStatus: "idle"}))}
        case "tasks/addTask": {
            const {task, task: {todoListId}} = action
            return {...state, [todoListId]: [{...task, entityStatus: "idle"}, ...state[todoListId]]}
        }
        case "tasks/deleteTask": {
            const {todoId, taskId} = action
            return {...state, [todoId]: state[todoId].filter(t => t.id !== taskId)}
        }
        case "tasks/updateTask": {
            const {newTask, newTask: {todoListId}} = action
            return {
                ...state,
                [todoListId]: state[todoListId].map(t => t.id === newTask.id
                    ? {...newTask, entityStatus: "idle"}
                    : t
                )
            }
        }
        case "tasks/setTaskStatus": {
            const {todoId, taskId, status} = action
            return {
                ...state,
                [todoId]: state[todoId].map(t => t.id === taskId
                    ? {...t, entityStatus: status}
                    : t
                )
            }
        }
        case "todolist/addTodolist":
            return {...state, [action.todo.id]: []}
        case "tasks/cleanTasks":
            return {}
        default:
            return state
    }
}

export const initTasks = (todoId: string, tasks: TaskType[]) => ({
    type: "tasks/initTasks",
    todoId,
    tasks
}) as const

export const addTask = (task: TaskType) => ({
    type: "tasks/addTask",
    task
}) as const

export const deleteTask = (todoId: string, taskId: string) => ({
    type: "tasks/deleteTask",
    todoId,
    taskId
}) as const

export const updateTask = (newTask: TaskType) => ({
    type: "tasks/updateTask",
    newTask
}) as const

export const setTaskStatus = (todoId: string, taskId: string, status: RequestStatusType) => ({
    type: "tasks/setTaskStatus",
    todoId,
    taskId,
    status
}) as const

export const cleanTasks = () => ({
    type: "tasks/cleanTasks"
}) as const

export const fetchTasksTC = (todoId: string): AppThunk => dispatch => {
    taskAPI.getTasks(todoId)
        .then(({data}) => {
            if (!data.error) {
                dispatch(initTasks(todoId, data.items))
            } else {
                const message = data.error || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e) => {
            handleError(e, dispatch)
        })
}

export const addTaskTC = (todoId: string, title: string): AppThunk<Promise<void>> => dispatch => {
    dispatch(setAppStatus("loading"))

    return taskAPI.addTask(todoId, title)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(addTask(data.data.item))
                dispatch(setAppStatus("success"))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e) => {
            handleError(e, dispatch)
        })
}

export const deleteTaskTC = (todoId: string, taskId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    dispatch(setTaskStatus(todoId, taskId, "loading"))
    taskAPI.deleteTask(todoId, taskId)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(deleteTask(todoId, taskId))
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

export const updateTaskTC = (todoId: string, taskId: string, patch: Partial<TaskModelType>): AppThunk =>
    (dispatch, getState) => {
        const task = selectTask(todoId, taskId)(getState())
        const model: TaskModelType = {
            description: task.description,
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            addedDate: task.addedDate,
            ...patch
        }

        dispatch(setAppStatus("loading"))
        dispatch(setTaskStatus(todoId, taskId, "loading"))
        taskAPI.updateTask(todoId, taskId, model)
            .then(({data}) => {
                if (data.resultCode === ResultCode.Ok) {
                    dispatch(updateTask(data.data.item))
                    dispatch(setAppStatus("success"))
                    dispatch(setTaskStatus(todoId, taskId, "success"))
                } else {
                    const message = data.messages[0] || "Something went wrong!"
                    throw new Error(message)
                }
            })
            .catch((e: Error | AxiosError) => {
                handleError(e, dispatch)
                dispatch(setTaskStatus(todoId, taskId, "failure"))
            })
    }

export const selectAllTasks = (todoId: string) => (state: RootStateType) => state.tasks[todoId]
export const selectFilteredTasks = (todoId: string, filter: FilterType) => {
    return (state: RootStateType) => {
        let tasks = selectAllTasks(todoId)(state)
        if (filter === "active") {
            tasks = tasks.filter(t => t.status === TaskStatus.Uncompleted)
        } else if (filter === "completed") {
            tasks = tasks.filter(t => t.status === TaskStatus.Completed)
        }

        return tasks
    }
}
export const selectTaskIds = (todoId: string, filter?: FilterType) => (state: RootStateType) => {
    const tasks = filter
        ? selectFilteredTasks(todoId, filter)(state)
        : selectAllTasks(todoId)(state)
    return tasks.map(t => t.id)
}
export const selectTask = (todoId: string, taskId: string) => (state: RootStateType) => {
    return selectAllTasks(todoId)(state).find(t => t.id === taskId) as TaskDomainType
}

export default taskReducer

export type TaskDomainType = {
    entityStatus: RequestStatusType
} & TaskType

type TasksStateType = {
    [key: string]: TaskDomainType[]
}

export type InitTasksAT = ReturnType<typeof initTasks>
export type addTaskAT = ReturnType<typeof addTask>
export type deleteTaskAT = ReturnType<typeof deleteTask>
export type updateTaskAT = ReturnType<typeof updateTask>
export type cleanTasksAT = ReturnType<typeof cleanTasks>
export type setTaskStatusAT = ReturnType<typeof setTaskStatus>

type TaskActionsType =
    InitTodolistsAT
    | AddTodolistAT
    | InitTasksAT
    | addTaskAT
    | deleteTaskAT
    | updateTaskAT
    | cleanTasksAT
    | setTaskStatusAT