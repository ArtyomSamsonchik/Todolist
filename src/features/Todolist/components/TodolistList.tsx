import React, { useCallback, useEffect } from 'react'
import Todolist from './Todolist'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Navigate } from 'react-router-dom'
import PATH from '../../../app/path'
import AddItemForm from '../../../common/components/AddItemForm/AddItemForm'
import { useAppSelector, useAppDispatch } from '../../../utils/hooks/hooks'
import { selectIsLoggedIn } from '../../Auth/auth-slice'
import { selectTodolistIds, fetchTodolists, addTodolist } from '../todolist-slice'

const TodolistList = React.memo(() => {
  const todoIds = useAppSelector(selectTodolistIds)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTodolists())
    }
  }, [dispatch, isLoggedIn])

  const handleAddTodolist = useCallback(
    (title: string) => dispatch(addTodolist(title)).unwrap(),
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to={`/${PATH.LOGIN}`} />
  }

  return (
    <>
      <Grid container spacing={3} justifyContent="center" px={2}>
        <Grid item xs={12}>
          <Box maxWidth={380} m="0 auto">
            <AddItemForm label="Add todolist" addItemCallback={handleAddTodolist} />
          </Box>
        </Grid>
        {todoIds.map(id => (
          <Todolist key={id} todoId={id as string} />
        ))}
      </Grid>
    </>
  )
})

export default TodolistList
