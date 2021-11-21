import { QueryClient, QueryClientProvider } from 'react-query'
import Repos from './Repos'
import Version from './Version'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Repos />
        <Version />
      </div>
    </QueryClientProvider>
  )
}

export default App
