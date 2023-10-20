import LogoutIcon from '@mui/icons-material/Logout'
import Drawer, { drawerClasses, DrawerProps } from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { FC, MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks'
import { logout, selectIsLoggedIn, selectUserEmail } from '../../features/Auth/auth-slice'

const drawerWidth = 280

type AppBarMenuProps = {
  open: boolean
  onClose?: DrawerProps['onClose']
}

const Sidebar: FC<AppBarMenuProps> = props => {
  const { open, onClose } = props

  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const email = useAppSelector(selectUserEmail)
  const dispatch = useAppDispatch()

  const handleLogout = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(logout())
    onClose?.(e, 'autoCloseOnLogout' as any)
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      keepMounted
      sx={{ [`& .${drawerClasses.paper}`]: { width: drawerWidth, maxWidth: '80%' } }}
      onClose={onClose}
    >
      <List>
        <ListItem disablePadding divider>
          <ListItemButton disabled={!isLoggedIn} onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: ({ spacing }) => spacing(6) }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemText>{email}</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  )
}

export default Sidebar
