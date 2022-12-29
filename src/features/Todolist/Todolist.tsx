import React, {FC, useCallback, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Task from "../Task/Task";
import AddItemForm from "../../common/components/AddItemForm/AddItemForm";
import ListItem from "@mui/material/ListItem";
import {ButtonGroup, IconButton} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks";
import {deleteTodolistTC, FilterType, selectTodolist, updateTodolist, updateTodolistTitleTC} from "./todolist-reducer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditableSpan from "../../common/components/EditableSpan";
import {addTaskTC, fetchTasksTC, selectTaskIds} from "../Task/task-reducer";
import {shallowEqual} from "react-redux";
import Button from "@mui/material/Button";

type TodolistProps = {
    todoId: string
}

const Todolist: FC<TodolistProps> = React.memo(({todoId}) => {
    const todo = useAppSelector(selectTodolist(todoId))
    const taskIds = useAppSelector(selectTaskIds(todoId, todo.filter), shallowEqual)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(todoId))
    }, [dispatch, todoId])

    const deleteTodo = () => {
        dispatch(deleteTodolistTC(todoId))
    }

    const handleChangeFilter = (filter: FilterType) => {
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
            <Paper elevation={3}>
                <List>
                    <ListItem component="div">
                        <EditableSpan
                            variant="h6"
                            disabled={todo.entityStatus === "loading"}
                            changeTitle={changeTodolistTitle}
                        >
                            {todo.title}
                        </EditableSpan>
                        <IconButton onClick={deleteTodo} disabled={todo.entityStatus === "loading"}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItem>
                    <ListItem component="div">
                        <AddItemForm
                            sx={{width: "auto"}}
                            label="Add todo item"
                            addItemCallback={handleAddTaskClick}
                        />
                    </ListItem>
                    {taskIds.map(id => <Task key={id} todoId={todoId} taskId={id}/>)}
                    <ListItem component="div">
                        <ButtonGroup sx={{
                            width: 1,
                            '& 	.MuiButton-root': {
                                flex: "1 1 auto"
                            }
                        }}>
                            <Button
                                variant={getButtonVariant("active")}
                                onClick={handleChangeFilter("active")}
                            >
                                Active
                            </Button>
                            <Button
                                variant={getButtonVariant("completed")}
                                onClick={handleChangeFilter("completed")}
                            >
                                Completed
                            </Button>
                            <Button
                                variant={getButtonVariant("all")}
                                onClick={handleChangeFilter("all")}
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

//  TODO: Add backdrop in todolist while the tasks are not loaded