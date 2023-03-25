import {AppDispatch} from "../../app/store";
import {setAppError, setAppStatus} from "../../app/app-slice";
import axios from "axios";

export const handleError = <T extends Error>(error: T, dispatch: AppDispatch) => {
    let message: string
    if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message
    } else {
        message = error.message
    }
    dispatch(setAppError(message))
    dispatch(setAppStatus("failure"))
}