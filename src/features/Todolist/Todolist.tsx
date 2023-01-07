import React, {FC, useCallback, useMemo} from 'react';
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Task from "../Task/Task";
import AddItemForm from "../../common/components/AddItemForm/AddItemForm";
import ListItem from "@mui/material/ListItem";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks";
import {deleteTodolistTC, FilterType, selectTodolist, updateTodolist, updateTodolistTitleTC} from "./todolist-reducer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditableSpan from "../../common/components/EditableSpan";
import {
    addTaskTC,
    filteredTasksSelectorFactory
} from "../Task/task-reducer";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MuiBackdrop from "@mui/material/Backdrop";

const TodolistBackdrop: FC<{ open: boolean }> = ({open}) => {
    return (
        <MuiBackdrop
            open={open}
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
                backgroundColor: "unset"
            }}
        >
            <CircularProgress
                sx={{color: theme => theme.palette.grey[600]}}
                size={50}
            />
        </MuiBackdrop>
    )
}

type TodolistProps = {
    todoId: string
}

const Todolist: FC<TodolistProps> = React.memo(({todoId}) => {
    const todo = useAppSelector(state => selectTodolist(state, todoId))
    const {selectFilteredTaskIds} = useMemo(filteredTasksSelectorFactory, [])
    const taskIds = useAppSelector(state => selectFilteredTaskIds(state, todoId, todo.filter))
    const dispatch = useAppDispatch()

    const todolistIsLoading = todo.entityStatus === "loading"
    const todolistIsFullyDisabled = todo.entityStatus === "fetchingTasks"
    || todo.entityStatus === "deleting"

    const deleteTodo = () => {
        dispatch(deleteTodolistTC(todoId))
    }

    const handleFilterChange = (filter: FilterType) => {
        return () => {
            if (todo.filter !== filter) {
                dispatch(updateTodolist(todoId, {filter}))
            }
        }
    }

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodolistTitleTC(todoId, title))
    }, [dispatch, todoId])

    const handleAddTaskClick = useCallback((title: string) => {
        return dispatch(addTaskTC(todoId, title))
    }, [dispatch, todoId])

    const getButtonVariant = (filter: FilterType) => {
        return todo.filter === filter ? "contained" : "outlined"
    }

    return (
        <Grid item>
            <Paper elevation={3} sx={{position: "relative"}}>
                <TodolistBackdrop open={todolistIsFullyDisabled}/>
                <List sx={{
                    opacity: theme => (
                        todolistIsFullyDisabled ? theme.palette.action.disabledOpacity : 1
                    )
                }}>
                    <ListItem component="div">
                        <EditableSpan
                            variant="h6"
                            disabled={todolistIsLoading}
                            changeTitle={changeTodolistTitle}
                        >
                            {todo.title}
                        </EditableSpan>
                        <IconButton onClick={deleteTodo} disabled={todolistIsLoading}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItem>
                    <ListItem component="div">
                        <AddItemForm
                            sx={{width: "auto"}}
                            label="Add todo item"
                            addItemCallback={handleAddTaskClick}
                            disabled={todolistIsLoading}
                        />
                    </ListItem>
                    {taskIds.map(id => <Task key={id} todoId={todoId} taskId={id}/>)}
                    <ListItem component="div">
                        <ButtonGroup sx={{
                            width: 1,
                            '& .MuiButton-root': {
                                flex: "1 1 auto"
                            }
                        }}
                        >
                            <Button
                                variant={getButtonVariant("active")}
                                onClick={handleFilterChange("active")}
                            >
                                Active
                            </Button>
                            <Button
                                variant={getButtonVariant("completed")}
                                onClick={handleFilterChange("completed")}
                            >
                                Completed
                            </Button>
                            <Button
                                variant={getButtonVariant("all")}
                                onClick={handleFilterChange("all")}
                            >
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