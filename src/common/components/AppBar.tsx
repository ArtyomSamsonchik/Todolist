import React, { useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MuiAppBar from '@mui/material/AppBar'
import ProgressBar from './ProgressBar/ProgressBar'
import { styled } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/icons-material/Menu'
import Sidebar from './Sidebar'

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

const AppBar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenMenuClick = () => setIsOpen(true)
  const handleCloseMenuClick = () => setIsOpen(false)

  return (
    <>
      <MuiAppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={handleOpenMenuClick}
          >
            <Menu />
          </IconButton>
          <Typography variant="h5">Todolist</Typography>
        </Toolbar>
        <ProgressBar />
      </MuiAppBar>
      <Offset />
      <Sidebar open={isOpen} onClose={handleCloseMenuClick} />
    </>
  )
})

export default AppBar
