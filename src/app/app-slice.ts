import {RootStateType} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initApp(state) {
            state.isInitialized = true
        },
        setAppStatus(state, action: PayloadAction<RequestStatusType>) {
            state.status = action.payload
        },
        setAppError(state, action: PayloadAction<string | null>) {
            state.error = action.payload
        },
    }
})

// selectors
export const selectAppStatus = (state: RootStateType) => state.app.status
export const selectAppError = (state: RootStateType) => state.app.error
export const selectIsInit = (state: RootStateType) => state.app.isInitialized

export const { initApp, setAppStatus, setAppError } = appSlice.actions
export default appSlice.reducer

export type RequestStatusType = "idle" | "loading" | "success" | "failure"
