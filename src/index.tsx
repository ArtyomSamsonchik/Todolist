import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './app/App'
import { Provider } from 'react-redux'
import store from './app/store'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import TodolistList from './features/Todolist/components/TodolistList'
import LoginPage from './features/Auth/LoginPage/LoginPage'
import { PATH } from './app/constants'
import AuthRedirect from './common/components/AuthRedirect'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const router = createHashRouter([
  {
    path: '/',
    element: (
      <StrictMode>
        <App />
      </StrictMode>
    ),
    children: [
      {
        // Place ONLY the elements you want to protect in AuthRedirect.
        // Do not place an element in AuthRedirect that you want to redirect to!
        // This may cause an infinite loop of redirects within AuthRedirect
        element: <AuthRedirect />,
        children: [
          {
            index: true,
            element: <TodolistList />,
          },
          {
            path: PATH.TODOLIST,
            element: <TodolistList />,
          },
        ],
      },
      {
        path: PATH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATH.ERROR,
        element: <h1>404 Page not found</h1>,
      },
      {
        path: '*',
        element: <Navigate to="404" />,
      },
    ],
  },
])

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
