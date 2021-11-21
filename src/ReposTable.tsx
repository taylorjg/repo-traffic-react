import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
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
          {items.map((item: Item) => <RepoRow key={item.repo.id} item={item} />)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ReposTable
