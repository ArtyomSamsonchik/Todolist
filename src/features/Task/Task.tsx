import React, { ChangeEvent, FC, useCallback } from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { deleteTaskTC, selectTask, updateTaskTC } from './task-slice'
import EditableSpan from '../../common/components/EditableSpan'
import { TaskStatus } from './task-api'

type TaskProps = {
  todoId: string
  taskId: string
}

const Task: FC<TaskProps> = React.memo(({ todoId, taskId }) => {
  const task = useAppSelector(state => selectTask(state, todoId, taskId))
  const dispatch = useAppDispatch()

  const handleDeleteTaskClick = () => {
    dispatch(deleteTaskTC(todoId, taskId))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.Uncompleted
    dispatch(updateTaskTC(todoId, taskId, { status }))
  }

  const changeTaskTitle = useCallback(
    (title: string) => {
      dispatch(updateTaskTC(todoId, taskId, { title }))
    },
    [dispatch, taskId, todoId]
  )

  return (
    <ListItem
      secondaryAction={
        <IconButton disabled={task.entityStatus === 'pending'} onClick={handleDeleteTaskClick}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          disabled={task.entityStatus === 'pending'}
          onChange={changeTaskStatus}
        />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={
          <EditableSpan disabled={task.entityStatus === 'pending'} changeTitle={changeTaskTitle}>
            {task.title}
          </EditableSpan>
        }
      />
    </ListItem>
  )
})

export default Task
