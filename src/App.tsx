import { Container, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import RepoTrafficTable from './RepoTrafficTable'
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
        <RepoTrafficTable />
        <Version />
      </Container>
    </QueryClientProvider>
  )
}

export default App
