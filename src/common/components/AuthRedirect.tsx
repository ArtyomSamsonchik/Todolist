import React, { FC } from 'react'
import { useAppSelector } from '../../utils/hooks/hooks'
import { selectIsLoggedIn } from '../../features/Auth/auth-slice'
import { Navigate, Outlet } from 'react-router-dom'
import { PATH } from '../../app/constants'
import useAppLocation from '../../utils/hooks/useAppLocation'

const AuthRedirect: FC = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const { pathname } = useAppLocation()

  return isLoggedIn ? <Outlet /> : <Navigate to={PATH.LOGIN} state={{ from: pathname }} />
}

export default AuthRedirect
