import { Container, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import RepoTraffic from './RepoTraffic'
import Version from './Version'
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
        <RepoTraffic />
        <Version />
      </Container>
    </QueryClientProvider>
  )
}

export default App
