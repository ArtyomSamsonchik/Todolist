import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { addTodolist, fetchTodolists, selectTodolistIds } from './todolist-slice'
import Todolist from './Todolist'
import { Grid } from '@mui/material'
import AddItemForm from '../../common/components/AddItemForm/AddItemForm'
import { selectIsLoggedIn } from '../Auth/auth-slice'
import { Navigate } from 'react-router-dom'
import PATH from '../../app/path'

const TodolistList = React.memo(() => {
  const todoIds = useAppSelector(selectTodolistIds)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTodolists())
    }
  }, [dispatch, isLoggedIn])

  const addTodolistCB = useCallback(
    async (title: string) => {
      await dispatch(addTodolist(title))
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to={`/${PATH.LOGIN}`} />
  }

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <AddItemForm label="Add todolist" addItemCallback={addTodolistCB} />
        </Grid>
        {todoIds.map(id => (
          <Todolist key={id} todoId={id} />
        ))}
      </Grid>
    </>
  )
})

export default TodolistList
