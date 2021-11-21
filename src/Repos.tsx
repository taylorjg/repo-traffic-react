import axios from 'axios'
import { useQuery } from 'react-query'
import TableRow from './TableRow'
import { Item } from './types'

const Repos = () => {

  const { isLoading, error, data } = useQuery<Item[], Error>('getRepos', () => axios.get('/api/repos').then(({ data }) => data))
  console.log({ isLoading, error, data })

  if (isLoading) return (
    <div>Loading...</div>
  )

  if (error) return (
    <div>An error has occurred: {error.message}</div>
  )

  const items = data ?? []

  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>views count</th>
          <th>views unique</th>
          <th>clones count</th>
          <th>clones unique</th>
          <th>forks</th>
          <th>stars</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: Item) => <TableRow key={item.repo.id} item={item} />)}
      </tbody>
    </table>
  )
}

export default Repos
