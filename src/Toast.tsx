import { useRef, useState } from 'react'
import { Alert, Snackbar, SnackbarOrigin, Slide, AlertColor } from '@mui/material'

export const useToast = () => {

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('success')

  const stableFunctionsRef = useRef({
    showSuccess: (message: string) => {
      setOpen(true)
      setMessage(message)
      setSeverity('success')
    },
    showInfo: (message: string) => {
      setOpen(true)
      setMessage(message)
      setSeverity('info')
    },
    showWarning: (message: string) => {
      setOpen(true)
      setMessage(message)
      setSeverity('warning')
    },
    showError: (message: string) => {
      setOpen(true)
      setMessage(message)
      setSeverity('error')
    }
  })

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
    ...stableFunctionsRef.current
  }
}
