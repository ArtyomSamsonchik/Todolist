import React, { FC, useCallback, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import ListItem from '@mui/material/ListItem'
import { selectTodolist, selectTodolistIsLoading, TodolistDomain } from '../../todolist-slice'
import { addTask, filteredTasksSelectorFactory } from '../../../Task/task-slice'
import AddItemForm from '../../../../common/components/AddItemForm/AddItemForm'
import { useAppDispatch, useAppSelector } from '../../../../utils/hooks/hooks'
import { LoadingBackdrop } from '../../../../common/components/LoadingBackdrop/LoadingBackdrop'
import { SxProps } from '@mui/material'
import Task from '../../../Task/Task'
import TodolistFilterButtons from './TodolistFilterButtons'
import TodolistHeader from './TodolistHeader'

const addItemFormSxProps: SxProps = { pl: 1, width: 0.95 }

const Todolist: FC<{ todoId: string }> = React.memo(({ todoId }) => {
  const { selectFilteredTaskIds } = useMemo(filteredTasksSelectorFactory, [])
  const todolist = useAppSelector(state => selectTodolist(state, todoId)) as TodolistDomain
  const taskIds = useAppSelector(state => selectFilteredTaskIds(state, todoId, todolist.filter))

  const isLoading = useAppSelector(state => selectTodolistIsLoading(state, todoId))
  const dispatch = useAppDispatch()

  const handleAddTask = useCallback(
    async (title: string) => dispatch(addTask({ todoId, title })).unwrap(),
    [dispatch, todoId]
  )

  return (
    <Grid item xs={12} sm={8} md={6} lg={4}>
      <Paper elevation={3} sx={{ position: 'relative' }}>
        {/*TODO: Replace LoadingBackdrop with Skeleton*/}
        <LoadingBackdrop open={todolist.tasksIds === null} />
        <List component="div">
          <TodolistHeader todolist={todolist} disabled={isLoading} />

          <ListItem component="div" sx={{ justifyContent: 'center' }}>
            <AddItemForm
              label="Add todo item"
              disabled={isLoading}
              addItemCallback={handleAddTask}
              sx={addItemFormSxProps}
            />
          </ListItem>

          <List
            disablePadding
            sx={{
              minHeight: '2em',
              maxHeight: '14em',
              overflow: 'auto',
              scrollbarWidth: 'thin',
            }}
          >
            {taskIds.map(id => (
              <Task key={id} todoId={todoId} taskId={id} />
            ))}
          </List>

          <TodolistFilterButtons todolist={todolist} disabled={isLoading} />
        </List>
      </Paper>
    </Grid>
  )
})

export default Todolist
