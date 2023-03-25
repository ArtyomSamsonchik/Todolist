import {AnyAction} from "redux";
import todolistSlice from "../features/Todolist/todolist-slice";
import {ThunkAction} from "redux-thunk";
import taskSlice from "../features/Task/task-slice";
import appSlice from "./app-slice";
import authSlice from "../features/Auth/auth-slice";
import {configureStore} from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        todolists: todolistSlice,
        tasks: taskSlice,
        app: appSlice,
        auth: authSlice
    },
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<R = void> = ThunkAction<R, RootStateType, undefined, AnyAction>

export default store

if (process.env.NODE_ENV === 'development') {
    //@ts-ignore
    window.store = store
}
