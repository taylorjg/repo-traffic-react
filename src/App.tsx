import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Button, Container, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import Home from './Home'
import Authorize from './Authorize'
import './App.css'

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
      <Button href="/" variant="contained">Home</Button>
    </Container>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Container className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/authorize" element={<Authorize />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </QueryClientProvider>
  )
}

export default App
