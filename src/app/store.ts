import {AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import todolistReducer from "../features/Todolist/todolist-reducer";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import taskReducer from "../features/Task/task-reducer";
import appReducer from "./app-reducer";
import authSlice from "../features/Auth/auth-slice";

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authSlice
})

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export type RootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootStateType, unknown, AnyAction>
export type AppThunk<R = void> = ThunkAction<R, RootStateType, unknown, AnyAction>

export default store

if (process.env.NODE_ENV === 'development') {
    //@ts-ignore
    window.store = store
}
