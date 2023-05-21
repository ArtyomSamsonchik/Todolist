import React, { ChangeEvent, FC, useCallback } from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { deleteTask, selectTask, selectTaskIsLoading, updateTask } from './task-slice'
import EditableSpan from '../../common/components/EditableSpan'
import { TaskStatus } from './task-api'

type TaskProps = {
  todoId: string
  taskId: string
}

const Task: FC<TaskProps> = React.memo(({ todoId, taskId }) => {
  const task = useAppSelector(state => selectTask(state, taskId))
  const isLoading = useAppSelector(state => selectTaskIsLoading(state, taskId))
  const dispatch = useAppDispatch()

  const handleDeleteTask = () => dispatch(deleteTask({ todoId, taskId }))

  const handleChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.Uncompleted
    const model = {
      todoId,
      taskId,
      patch: { status },
    }

    dispatch(updateTask(model))
  }

  const changeTaskTitle = useCallback(
    (title: string) => {
      const model = {
        todoId,
        taskId,
        patch: { title },
      }

      dispatch(updateTask(model))
    },
    [dispatch, taskId, todoId]
  )

  if (!task) return null

  return (
    <ListItem
      secondaryAction={
        <IconButton disabled={isLoading} onClick={handleDeleteTask}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          disabled={isLoading}
          onChange={handleChangeTaskStatus}
        />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={
          <EditableSpan disabled={isLoading} changeTitle={changeTaskTitle}>
            {task.title}
          </EditableSpan>
        }
      />
    </ListItem>
  )
})

export default Task
