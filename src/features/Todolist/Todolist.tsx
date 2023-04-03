import React, { FC, useCallback, useMemo } from 'react'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Task from '../Task/Task'
import ListItem from '@mui/material/ListItem'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import MuiBackdrop from '@mui/material/Backdrop'

import {
  deleteTodolist,
  Filter,
  selectTodolist,
  selectTodolistIsLoading,
  updateTodolistFilter,
  updateTodolistTitle,
} from './todolist-slice'
import { addTask, filteredTasksSelectorFactory } from '../Task/task-slice'

import AddItemForm from '../../common/components/AddItemForm/AddItemForm'
import EditableSpan from '../../common/components/EditableSpan'

import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'

const TodolistBackdrop: FC<{ open: boolean }> = ({ open }) => {
  return (
    <MuiBackdrop
      open={open}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        backgroundColor: 'unset',
      }}
    >
      <CircularProgress sx={{ color: theme => theme.palette.grey[600] }} size={50} />
    </MuiBackdrop>
  )
}

type TodolistProps = { todoId: string }

const Todolist: FC<TodolistProps> = React.memo(({ todoId }) => {
  const { selectFilteredTaskIds } = useMemo(filteredTasksSelectorFactory, [])
  const todolist = useAppSelector(state => selectTodolist(state, todoId))
  const taskIds = useAppSelector(state => selectFilteredTaskIds(state, todoId, todolist.filter))
  const isLoading = useAppSelector(state => selectTodolistIsLoading(state, todoId))

  const dispatch = useAppDispatch()

  const handleDeleteTodolist = () => dispatch(deleteTodolist(todoId))

  const handleFilterChange = (filter: Filter) => () => {
    if (todolist.filter === filter) return

    dispatch(updateTodolistFilter({ todoId, filter }))
  }

  const changeTodolistTitle = useCallback(
    (title: string) => dispatch(updateTodolistTitle({ todoId, title })),
    [dispatch, todoId]
  )

  const handleAddTaskClick = useCallback(
    (title: string) => dispatch(addTask({ todoId, title })),
    [dispatch, todoId]
  )

  const getButtonVariant = (filter: Filter) => {
    return todolist.filter === filter ? 'contained' : 'outlined'
  }

  return (
    <Grid item>
      <Paper elevation={3} sx={{ position: 'relative' }}>
        <TodolistBackdrop open={isLoading} />
        <List
          sx={{
            opacity: theme => (isLoading ? theme.palette.action.disabledOpacity : 1),
          }}
        >
          <ListItem component="div">
            <EditableSpan variant="h6" disabled={isLoading} changeTitle={changeTodolistTitle}>
              {todolist.title}
            </EditableSpan>
            <IconButton onClick={handleDeleteTodolist} disabled={isLoading}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
          <ListItem component="div">
            <AddItemForm
              sx={{ width: 'auto' }}
              label="Add todo item"
              addItemCallback={handleAddTaskClick}
            />
          </ListItem>
          {taskIds.map(id => (
            <Task key={id} todoId={todoId} taskId={id} />
          ))}
          <ListItem component="div">
            <ButtonGroup
              sx={{
                width: 1,
                '& .MuiButton-root': {
                  flex: '1 1 auto',
                },
              }}
            >
              <Button variant={getButtonVariant('active')} onClick={handleFilterChange('active')}>
                Active
              </Button>
              <Button
                variant={getButtonVariant('completed')}
                onClick={handleFilterChange('completed')}
              >
                Completed
              </Button>
              <Button variant={getButtonVariant('all')} onClick={handleFilterChange('all')}>
                All
              </Button>
            </ButtonGroup>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  )
})

export default Todolist
