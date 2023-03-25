import {AppThunk, RootStateType} from "../../app/store";
import {authAPI, LoginConfigType, ResultCode} from "../../app/api";
import {initApp, setAppStatus} from "../../app/app-slice";
import {cleanTodolists} from "../Todolist/todolist-slice";
import {cleanTasks} from "../Task/task-slice";
import {AxiosError} from "axios";
import {handleError} from "../../utils/helpers/handleErrors";
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) { state.isLoggedIn = true },
    logout(state) { state.isLoggedIn = false },
  },
})

// thunks
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

export const logoutTC = (): AppThunk<Promise<void>> => dispatch => {
    dispatch(setAppStatus("loading"))
    return authAPI.logout()
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

// selectors
export const selectIsLoggedIn = (state: RootStateType) => state.auth.isLoggedIn

export const { login, logout } = authSlice.actions
export default authSlice.reducer