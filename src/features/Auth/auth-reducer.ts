import {AppThunk, RootStateType} from "../../app/store";
import {authAPI, LoginConfigType, ResultCode} from "../../app/api";
import {initApp, setAppStatus} from "../../app/app-reducer";
import {cleanTodolists} from "../Todolist/todolist-reducer";
import {cleanTasks} from "../Task/task-reducer";
import {AxiosError} from "axios";
import {handleError} from "../../common/utils/handleErrors";

type AuthStateType = {
    isLoggedIn: boolean
}

const initialState: AuthStateType = {
    isLoggedIn: false
}

const authReducer = (state = initialState, action: ActionsType): AuthStateType => {
    switch (action.type) {
        case "auth/login":
            return {...state, isLoggedIn: true}
        case "auth/logout":
            return {...state, isLoggedIn: false}
        default:
            return state
    }
}

export const login = () => ({
    type: "auth/login"
}) as const

export const logout = () => ({
    type: "auth/logout"
}) as const

export const loginTC = (config: LoginConfigType): AppThunk<Promise<void>> => dispatch => {
    dispatch(setAppStatus("loading"))
    return authAPI.login(config)
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(login())
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

export const logoutTC = (): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    authAPI.logout()
        .then(({data}) => {
            if (data.resultCode === ResultCode.Ok) {
                dispatch(logout())
                dispatch(cleanTodolists())
                dispatch(cleanTasks())
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

export const authMeTC = (): AppThunk => dispatch => {
    authAPI.me()
        .then(({data}) => {
            dispatch(initApp())
            if (data.resultCode === ResultCode.Ok) {
                dispatch(login())
            } else {
                const message = data.messages[0] || "Something went wrong!"
                throw new Error(message)
            }
        })
        .catch((e: Error | AxiosError) => {
            handleError(e, dispatch)
        })
}

export const selectIsLoggedIn = (state: RootStateType) => state.auth.isLoggedIn

export default authReducer

export type LoginAT = ReturnType<typeof login>
export type LogoutAT = ReturnType<typeof logout>
type ActionsType = LoginAT | LogoutAT