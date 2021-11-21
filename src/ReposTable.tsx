import axios from 'axios'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from 'react-query'
import RepoRow from './RepoRow'
import { Item } from './types'

const ReposTable = () => {

  const { isLoading, error, data: items = [] } = useQuery<Item[], Error>('getRepos', () => axios.get('/api/repos').then(({ data }) => data))

  if (isLoading) return (
    <div>Loading...</div>
  )

  if (error) return (
    <div>An error has occurred: {error.message}</div>
  )

  const filteredItems = items.filter(item => (
    item.views.count > 0 ||
    item.clones.count > 0 ||
    item.repo.forks_count > 0 ||
    item.repo.stargazers_count > 0
  ))

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>name</TableCell>
            <TableCell>views count</TableCell>
            <TableCell>views unique</TableCell>
            <TableCell>clones count</TableCell>
            <TableCell>clones unique</TableCell>
            <TableCell>forks</TableCell>
            <TableCell>stars</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.map((item: Item) => <RepoRow key={item.repo.id} item={item} />)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ReposTable
