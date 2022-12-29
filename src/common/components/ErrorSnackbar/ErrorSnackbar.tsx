import React from 'react';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {selectAppError, setAppError} from "../../../app/app-reducer";

let message = ""

const ErrorSnackbar = React.memo(() => {
    const error = useAppSelector(selectAppError)
    const dispatch = useAppDispatch()

    if (error) message = error

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return

        dispatch(setAppError(null))
    }

    return (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={handleClose}
                >
                    {message}
                </Alert>
            </Snackbar>
    )
})

export default ErrorSnackbar
