import {RootStateType} from "./store";

export type RequestStatusType = "idle" | "loading" | "success" | "failure"

type AppStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

const initialState: AppStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}

const appReducer = (state = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case "app/changeStatus":
            return {...state, status: action.status}
        case "app/setError":
            return {...state, error: action.error}
        case "app/init":
            return {...state, isInitialized: true}
        default:
            return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({
    type: "app/changeStatus",
    status
}) as const

export const setAppError = (error: string | null) => ({
    type: "app/setError",
    error
}) as const

export const initApp = () => ({
    type: "app/init"
}) as const

export const selectAppStatus = (state: RootStateType) => state.app.status
export const selectAppError = (state: RootStateType) => state.app.error
export const selectIsInit = (state: RootStateType) => state.app.isInitialized

export default appReducer

export type setAppStatusAT = ReturnType<typeof setAppStatus>
export type setAppErrorAT = ReturnType<typeof setAppError>
export type initAppAT = ReturnType<typeof initApp>
type ActionsType = setAppStatusAT | setAppErrorAT | initAppAT