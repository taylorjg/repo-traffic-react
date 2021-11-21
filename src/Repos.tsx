import { useQuery } from 'react-query'
import TableRow from './TableRow'

const Repos = () => {

  const { isLoading, error, data } = useQuery('', () => fetch('/api/repos').then(res => res.json()))
  console.log({ isLoading, error, data })

  if (isLoading) return <div>'Loading...'</div>

  // if (error) return 'An error has occurred: ' + error.message
  if (error) return <div>'An error has occurred'</div>

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
