import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import Authorize from './Authorize'
import Home from './Home'
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Container className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/authorize" element={<Authorize />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </QueryClientProvider>
  )
}

export default App
