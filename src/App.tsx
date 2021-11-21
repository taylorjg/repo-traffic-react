import { QueryClient, QueryClientProvider } from 'react-query'
import Repos from './Repos'
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

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Repos />
      </div>
    </QueryClientProvider>
  )
}

export default App
