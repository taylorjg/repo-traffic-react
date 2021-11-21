import axios from 'axios'
import { useQuery } from 'react-query'
import TableRow from './TableRow'

const Repos = () => {

  const { isLoading, error, data } = useQuery<any, Error>('getRepos', () => axios.get('/api/repos').then(({ data }) => data))
  console.log({ isLoading, error, data })

  if (isLoading) return (
    <div>'Loading...'</div>
  )

  if (error) return (
    <div>'An error has occurred: ' {error.message}</div>
  )

  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>forks</th>
          <th>stars</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => <TableRow key={item.repo.id} item={item} />)}
      </tbody>
    </table>
  )
}

export default Repos
