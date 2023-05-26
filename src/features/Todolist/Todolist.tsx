import React, { FC, useCallback, useMemo, useState } from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Task from '../Task/Task'
import ListItem from '@mui/material/ListItem'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import {
  deleteTodolist,
  StatusFilter,
  selectTodolist,
  selectTodolistIsLoading,
  updateTodolistFilter,
  updateTodolistTitle,
  TodolistDomain,
} from './todolist-slice'
import { addTask, filteredTasksSelectorFactory } from '../Task/task-slice'
import AddItemForm from '../../common/components/AddItemForm/AddItemForm'
import EditableSpan from '../../common/components/EditableSpan/EditableSpan'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { LoadingBackdrop } from '../../common/components/LoadingBackdrop/LoadingBackdrop'
import { capitalize } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'

const Todolist: FC<{ todoId: string }> = React.memo(({ todoId }) => {
  const { selectFilteredTaskIds } = useMemo(filteredTasksSelectorFactory, [])
  const todolist = useAppSelector(state => selectTodolist(state, todoId)) as TodolistDomain
  const taskIds =
    useAppSelector(state => selectFilteredTaskIds(state, todoId, todolist.filter)) || []

  const isLoading = useAppSelector(state => selectTodolistIsLoading(state, todoId))
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useAppDispatch()

  const handleDeleteTodolist = () => dispatch(deleteTodolist(todoId))

  const handleFilterChange = (filter: StatusFilter) => () => {
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

  const getButtonVariant = (filter: StatusFilter) => {
    return todolist.filter === filter ? 'contained' : 'outlined'
  }

  return (
    <Grid item>
      <Paper elevation={3} sx={{ position: 'relative' }}>
        <LoadingBackdrop open={isLoading} />
        <List component="div">
          <ListItem
            component="div"
            secondaryAction={
              !isEditing && (
                <IconButton onClick={handleDeleteTodolist} disabled={isLoading}>
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              disableTypography
              primary={
                <EditableSpan
                  variant="h6"
                  disabled={isLoading}
                  changeTitle={changeTodolistTitle}
                  onToggleEditMode={setIsEditing}
                >
                  {todolist.title}
                </EditableSpan>
              }
            />
          </ListItem>
          <ListItem component="div">
            <AddItemForm
              sx={{ width: 'auto' }}
              label="Add todo item"
              addItemCallback={handleAddTaskClick}
            />
          </ListItem>
          <ul>
            {taskIds.map(id => (
              <Task key={id} todoId={todoId} taskId={id} />
            ))}
          </ul>
          <ListItem component="div">
            <ButtonGroup
              sx={{
                width: 1,
                '& .MuiButton-root': {
                  flex: '1 1 auto',
                },
              }}
            >
              {(['active', 'completed', 'all'] as StatusFilter[]).map(name => (
                <Button
                  key={name}
                  variant={getButtonVariant(name)}
                  onClick={handleFilterChange(name)}
                >
                  {capitalize(name)}
                </Button>
              ))}
            </ButtonGroup>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  )
})

export default Todolist
