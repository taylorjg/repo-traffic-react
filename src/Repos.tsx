import { useQuery } from 'react-query'

const Repos = () => {

  const { isLoading, error, data } = useQuery('', () => fetch('/api/repos').then(res => res.json()))
  console.log({ isLoading, error, data })

  if (isLoading) return <div>'Loading...'</div>

  // if (error) return 'An error has occurred: ' + error.message
  if (error) return <div>'An error has occurred'</div>

  return (
    <div>data.length: {data.length}</div>
  )
}

export default Repos
