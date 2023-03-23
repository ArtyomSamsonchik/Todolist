import React from 'react';
import {useAppSelector} from "../../hooks/hooks";
import {selectAppStatus} from "../../../app/app-slice";
import LinearProgress from "@mui/material/LinearProgress";

const ProgressBar = () => {
    const status = useAppSelector(selectAppStatus)

    return status === "loading" ? <LinearProgress color="secondary"/> : null
}

export default ProgressBar