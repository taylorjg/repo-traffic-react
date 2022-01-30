import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createTheme, Button, Container, CssBaseline, ThemeProvider } from '@mui/material'

import Home from './Home'
import Authorize from './Authorize'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false
    }
  }
})

const NotFound = () => {
  const location = useLocation()
  return (
    <Container maxWidth="sm">
      <p>
        Path not found: <code>"{location.pathname}"</code>.
      </p>
      <Button href="/" variant="contained" size="small">Home</Button>
    </Container>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container sx={{ mt: '2rem' }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/index.html" element={<Home />} />
              <Route path="/authorize" element={<Authorize />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
