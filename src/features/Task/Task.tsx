import React, { ChangeEvent, FC, useCallback, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { deleteTask, selectTask, selectTaskIsLoading, updateTask } from './task-slice'
import { TaskStatus } from './task-api'
import EditableSpan from '../../common/components/EditableSpan/EditableSpan'

type TaskProps = {
  todoId: string
  taskId: string
}

const Task: FC<TaskProps> = React.memo(({ todoId, taskId }) => {
  const task = useAppSelector(state => selectTask(state, taskId))
  const isLoading = useAppSelector(state => selectTaskIsLoading(state, taskId))
  const dispatch = useAppDispatch()

  const [isEditing, setIsEditing] = useState(false)

  const handleDeleteTask = () => dispatch(deleteTask({ todoId, taskId }))

  const handleChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.Uncompleted

    dispatch(updateTask({ todoId, taskId, patch: { status } }))
  }

  const changeTaskTitle = useCallback(
    (title: string) => {
      return dispatch(updateTask({ todoId, taskId, patch: { title } })).unwrap()
    },
    [dispatch, taskId, todoId]
  )

  if (!task) return null

  return (
    <ListItem
      secondaryAction={
        !isEditing && (
          <IconButton disabled={isLoading} onClick={handleDeleteTask}>
            <DeleteIcon />
          </IconButton>
        )
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          disabled={isLoading || isEditing}
          onChange={handleChangeTaskStatus}
        />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={
          <EditableSpan
            disabled={isLoading}
            changeTitle={changeTaskTitle}
            onToggleEditMode={setIsEditing}
          >
            {task.title}
          </EditableSpan>
        }
      />
    </ListItem>
  )
})

export default Task
