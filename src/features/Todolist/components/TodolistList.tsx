import React, { useCallback, useEffect } from 'react'
import Todolist from './Todolist'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import AddItemForm from '../../../common/components/AddItemForm/AddItemForm'
import { useAppDispatch, useAppSelector } from '../../../utils/hooks/hooks'
import { selectIsLoggedIn } from '../../Auth/auth-slice'
import { addTodolist, fetchTodolists, selectTodolistIds } from '../todolist-slice'
import { fetchTasks } from '../../Task/task-slice'

const TodolistList = React.memo(() => {
  const todoIds = useAppSelector(selectTodolistIds)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isLoggedIn) {
      const loadTodolistsData = async () => {
        const todolists = await dispatch(fetchTodolists()).unwrap()

        if (todolists) {
          for (let { id } of todolists) {
            await dispatch(fetchTasks(id))
          }
        }
      }

      loadTodolistsData()
    }
  }, [dispatch, isLoggedIn])

  const handleAddTodolist = useCallback(
    async (title: string) => dispatch(addTodolist(title)).unwrap(),
    [dispatch]
  )

  return (
    <>
      <Box maxWidth={400} mx="auto" my={{ xs: 2, sm: 3 }}>
        <AddItemForm label="Add todolist" addItemCallback={handleAddTodolist} />
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{ justifyContent: { sm: 'center', md: 'flex-start' } }}
      >
        {todoIds.map(id => (
          <Todolist key={id} todoId={id as string} />
        ))}
      </Grid>
    </>
  )
})

export default TodolistList
