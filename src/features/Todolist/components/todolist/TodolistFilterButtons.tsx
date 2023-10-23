import React, { FC } from 'react'
import ButtonGroup from '@mui/material/ButtonGroup'
import { StatusFilter, TodolistDomain, updateTodolistFilter } from '../../todolist-slice'
import Button from '@mui/material/Button'
import { capitalize } from '@mui/material'
import { useAppDispatch } from '../../../../utils/hooks/hooks'
import ListItem from '@mui/material/ListItem'

type ControlButtonsProps = {
  todolist: TodolistDomain
  disabled?: boolean
}

const TodolistFilterButtons: FC<ControlButtonsProps> = ({ todolist, disabled }) => {
  const dispatch = useAppDispatch()

  const getButtonVariant = (filter: StatusFilter) => {
    return todolist.filter === filter ? 'contained' : 'outlined'
  }

  const handleFilterChange = (filter: StatusFilter) => () => {
    if (todolist.filter === filter) return

    dispatch(updateTodolistFilter({ todoId: todolist.id, filter }))
  }

  return (
    <ListItem component="div">
      <ButtonGroup
        disabled={disabled}
        sx={{
          width: 1,
          '& .MuiButton-root': { flex: '1 1 auto' },
        }}
      >
        {(['active', 'completed', 'all'] as StatusFilter[]).map(filter => (
          <Button
            key={filter}
            variant={getButtonVariant(filter)}
            onClick={handleFilterChange(filter)}
          >
            {capitalize(filter)}
          </Button>
        ))}
      </ButtonGroup>
    </ListItem>
  )
}

export default TodolistFilterButtons
