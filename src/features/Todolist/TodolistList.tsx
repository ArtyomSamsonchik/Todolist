import React, {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks";
import {addTodolistTC, fetchTodolistsTC, selectTodolistIds} from "./todolist-reducer";
import Todolist from "./Todolist";
import {Grid} from "@mui/material";
import AddItemForm from "../../common/components/AddItemForm/AddItemForm";
import {selectIsLoggedIn} from "../Auth/auth-reducer";
import {Navigate} from "react-router-dom";

const TodolistList = React.memo(() => {
    const todoIds = useAppSelector(selectTodolistIds)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchTodolistsTC())
        }
    }, [dispatch, isLoggedIn])

    const addTodolist = useCallback(async (title: string) => {
        return dispatch(addTodolistTC(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to="/login"/>
    }

    return (
        <>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12}>
                    <AddItemForm label="Add todolist" addItemCallback={addTodolist}/>
                </Grid>
                {todoIds.map(id => <Todolist key={id} todoId={id}/>)}
            </Grid>
        </>
    )
})

export default TodolistList