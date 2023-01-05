import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import {Provider} from "react-redux";
import store from "./app/store";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import TodolistList from "./features/Todolist/TodolistList";
import LoginPage from "./features/Auth/LoginPage/LoginPage";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <TodolistList/>
            },
            {
                path: "/login",
                element: <LoginPage/>
            },
            {
                path: "/404",
                element: <h1>404 Page not found</h1>
            },
            {
                path: "*",
                element: <Navigate to="/404"/>
            }
        ]
    }
],
    {
        basename: "/Todolist"
    }
    )

root.render(
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
)
