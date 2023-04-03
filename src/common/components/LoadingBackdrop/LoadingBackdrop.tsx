import React, { FC } from 'react'
import MuiBackdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export const LoadingBackdrop: FC<{ open: boolean }> = ({ open }) => {
  return (
    <MuiBackdrop
      open={open}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.38)',
        opacity: ({ palette }) => palette.action.disabledOpacity,
      }}
    >
      <CircularProgress sx={{ color: theme => theme.palette.grey[600] }} size={50} />
    </MuiBackdrop>
  )
}
