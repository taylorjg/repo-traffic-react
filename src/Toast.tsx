import { useState } from 'react'
import { Alert, Snackbar, SnackbarOrigin, Slide, AlertColor } from '@mui/material'

export const useToast = () => {

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('success')

  const showCommon = (message: string, severity: AlertColor) => {
    setOpen(true)
    setMessage(message)
    setSeverity(severity)
  }

  const showSuccess = (message: string) => showCommon(message, 'success')
  const showInfo = (message: string) => showCommon(message, 'info')
  const showWarning = (message: string) => showCommon(message, 'warning')
  const showError = (message: string) => showCommon(message, 'error')

  const handleClose = () => {
    setOpen(false)
    setMessage('')
  }

  const anchorOrigin: SnackbarOrigin = {
    horizontal: 'center',
    vertical: 'bottom'
  }

  const renderToast = () => {
    return (
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        TransitionComponent={Slide}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    )
  }

  return {
    renderToast,
    showSuccess,
    showInfo,
    showWarning,
    showError
  }
}
