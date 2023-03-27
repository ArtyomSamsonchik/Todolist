import React, { ChangeEvent, FC, useCallback, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { deleteTask, selectTask, updateTask } from './task-slice'
import EditableSpan from '../../common/components/EditableSpan'
import { TaskStatus } from './task-api'

type TaskProps = {
  todoId: string
  taskId: string
}

const Task: FC<TaskProps> = React.memo(({ todoId, taskId }) => {
  const task = useAppSelector(state => selectTask(state, todoId, taskId))
  const [taskStatus, setTaskStatus] = useState<'loading' | 'idle'>('idle')
  const dispatch = useAppDispatch()

  const handleDeleteTask = async () => {
    setTaskStatus('loading')
    await dispatch(deleteTask({ todoId, taskId }))
    setTaskStatus('idle')
  }

  const handleChangeTaskStatus = async (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.Uncompleted

    setTaskStatus('loading')
    await dispatch(
      updateTask({
        todoId,
        taskId,
        patch: { status },
      })
    )
    setTaskStatus('idle')
  }

  const changeTaskTitle = useCallback(
    async (title: string) => {
      setTaskStatus('loading')
      await dispatch(
        updateTask({
          todoId,
          taskId,
          patch: { title },
        })
      )
      setTaskStatus('idle')
    },
    [dispatch, updateTask, taskId, todoId]
  )

  const taskIsLoading = taskStatus === 'loading'

  return (
    <ListItem
      secondaryAction={
        <IconButton disabled={taskIsLoading} onClick={handleDeleteTask}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          disabled={taskIsLoading}
          onChange={handleChangeTaskStatus}
        />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={
          <EditableSpan disabled={taskIsLoading} changeTitle={changeTaskTitle}>
            {task.title}
          </EditableSpan>
        }
      />
    </ListItem>
  )
})

export default Task
