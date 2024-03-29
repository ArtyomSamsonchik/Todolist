import React, { FC, useCallback, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'
import EditableSpan, {
  EditableSpanProps,
} from '../../../../common/components/EditableSpan/EditableSpan'
import ListItem from '@mui/material/ListItem'
import { SxProps } from '@mui/material'
import { deleteTodolist, TodolistDomain, updateTodolistTitle } from '../../todolist-slice'
import { useAppDispatch } from '../../../../utils/hooks/hooks'

const editableSpanProps: Partial<EditableSpanProps> = {
  typographyProps: { variant: 'h6' },
  sx: { ' & .MuiTypography-root': { pt: 0.5 } },
}

type TodolistHeaderProps = {
  todolist: TodolistDomain
  disabled?: boolean
}

const TodolistHeader: FC<TodolistHeaderProps> = ({ todolist, disabled }) => {
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useAppDispatch()

  const handleDeleteTodolist = () => dispatch(deleteTodolist(todolist.id))

  const changeTodolistTitle = useCallback(
    (title: string) => dispatch(updateTodolistTitle({ todoId: todolist.id, title })).unwrap(),
    [dispatch, todolist.id]
  )

  return (
    <ListItem
      component="div"
      secondaryAction={
        !isEditing && (
          <IconButton onClick={handleDeleteTodolist} disabled={disabled}>
            <DeleteIcon />
          </IconButton>
        )
      }
    >
      <ListItemText
        sx={{ pl: 1.5 }}
        disableTypography
        primary={
          <EditableSpan
            disabled={disabled}
            changeTitle={changeTodolistTitle}
            onToggleEditMode={setIsEditing}
            {...editableSpanProps}
          >
            {todolist.title}
          </EditableSpan>
        }
      />
    </ListItem>
  )
}

export default TodolistHeader
