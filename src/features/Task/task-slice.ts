import {ResultCode, taskAPI, TaskModel, TaskStatus, Task} from "../../app/api";
import {
    addTodolist,
    Filter,
    initTodolists,
    removeTodolist,
    setTodolistStatus
} from "../Todolist/todolist-slice";
import {AppThunk, RootStateType} from "../../app/store";
import {RequestStatus, setAppStatus} from "../../app/app-slice";
import {handleError} from "../../utils/helpers/handleErrors";
import {AxiosError} from "axios";
import {createSelector} from "reselect";
import {shallowEqual} from "react-redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createTaskDomainEntity} from "../../utils/helpers/createTaskDomainEntity";

const taskSlice = createSlice({
    name: 'task',
    initialState: {} as TasksState,
    reducers: {
        initTasks(state, action: PayloadAction<{ todoId: string, tasks: Task[] }>) {
            const {todoId, tasks} = action.payload

            state[todoId] = tasks.map<TaskDomain>(t => createTaskDomainEntity(t))
        },
        addTask(state, action: PayloadAction<Task>) {
            const {todoListId} = action.payload
            const newTask: TaskDomain = createTaskDomainEntity(action.payload)

            state[todoListId].unshift(newTask)
        },
        deleteTask(state, action: PayloadAction<{ todoId: string, taskId: string }>) {
            const {todoId, taskId} = action.payload

            state[todoId] = state[todoId].filter(t => t.id !== taskId)
        },
        updateTask(state, action: PayloadAction<Task>) {
            const newTask = action.payload
            const {todoListId} = action.payload
            const index = state[todoListId].findIndex(t => t.id === newTask.id)

            state[todoListId][index] = createTaskDomainEntity(newTask)
        },
        setTaskStatus(
            state,
            action: PayloadAction<{ todoId: string, taskId: string, status: RequestStatus }>
        ) {
            const {todoId, taskId, status} = action.payload
            const task = state[todoId].find(t => t.id === taskId)

            if (task) task.entityStatus = status
        },
        cleanTasks(state) {
            state = {}
        },
    },
    extraReducers: builder => {
        builder.addCase(initTodolists, (state, action) => {
            action.payload.forEach(tl => {
                state[tl.id] = []
            })
        })
        builder.addCase(addTodolist, (state, action) => {
            const {id} = action.payload

            state[id] = []
        })
        builder.addCase(removeTodolist, (state, action) => {
            delete state[action.payload]
        })
    }
})

// thunks
export const fetchTasksTC = (todoId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    dispatch(setTodolistStatus({todoId, status: "fetchingTasks"}))
    taskAPI.getTasks(todoId)
        .then(({data}) => {
            if (!data.error) {
                dispatch(initTasks({todoId, tasks: data.items}))
                dispatch(setAppStatus("success"))
                dispatch(setTodolistStatus({todoId, status: "success"}))
            } else {
                const message = data.error || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e) => {
            handleError(e, dispatch)
            dispatch(setTodolistStatus({todoId, status: "failure"}))
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
    dispatch(setTaskStatus({todoId, taskId, status: "loading"}))
    taskAPI.deleteTask(todoId, taskId)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(deleteTask({todoId, taskId}))
                dispatch(setAppStatus("success"))
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
            dispatch(setTaskStatus({todoId, taskId, status: "failure"}))
        })
}

export const updateTaskTC = (todoId: string, taskId: string, patch: Partial<TaskModel>): AppThunk =>
    (dispatch, getState) => {
        const task = selectTask(getState(), todoId, taskId)
        const model: TaskModel = {
            description: task.description,
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            addedDate: task.addedDate,
            ...patch
        }

        dispatch(setAppStatus("loading"))
        dispatch(setTaskStatus({todoId, taskId, status: "loading"}))
        taskAPI.updateTask(todoId, taskId, model)
            .then(({data}) => {
                if (data.resultCode === ResultCode.Ok) {
                    dispatch(updateTask(data.data.item))
                    dispatch(setAppStatus("success"))
                    dispatch(setTaskStatus({todoId, taskId, status: "success"}))
                } else {
                    const message = data.messages[0] || "Something went wrong!"
                    throw new Error(message)
                }
            })
            .catch((e: Error | AxiosError) => {
                handleError(e, dispatch)
                dispatch(setTaskStatus({todoId, taskId, status: "failure"}))
            })
    }

// selectors
export const selectTasks = (state: RootStateType, todoId: string) => state.tasks[todoId]

// Use this factory inside useMemo in Todolist component to provide every Todolist
// instance his own selector.
export const filteredTasksSelectorFactory = () => {
    const selectFilteredTasks = createSelector(
        (state: RootStateType, todoId: string) => selectTasks(state, todoId),
        (state: RootStateType, todoId: string, filter: Filter) => filter,
        (tasks, filter) => {
            if (filter === "active") {
                return tasks.filter(t => t.status === TaskStatus.Uncompleted)
            }
            if (filter === "completed") {
                return tasks.filter(t => t.status === TaskStatus.Completed)
            }

            return tasks
        }
    )

    const selectFilteredTaskIds = createSelector(
        selectFilteredTasks,
        tasks => tasks.map(t => t.id),
        {
            memoizeOptions: {
                resultEqualityCheck: shallowEqual
            }
        }
    )

    return {selectFilteredTasks, selectFilteredTaskIds}
}

export const selectTask = (state: RootStateType, todoId: string, taskId: string) => {
    return selectTasks(state, todoId).find(t => t.id === taskId) as TaskDomain
}

export const {
    initTasks,
    addTask,
    deleteTask,
    updateTask,
    setTaskStatus,
    cleanTasks
} = taskSlice.actions

export default taskSlice.reducer

export type TaskDomain = Task & {
    entityStatus: RequestStatus
}

type TasksState = Record<string, TaskDomain[]>