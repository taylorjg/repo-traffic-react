import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import RepoTrafficTableRow from './RepoTrafficTableRow'
import { RepoData } from './types'

export type RepoTrafficTableProps = {
  rows: RepoData[]
}

const RepoTrafficTable: React.FC<RepoTrafficTableProps> = ({ rows }) => {

  const filteredRows = rows.filter(row => (
    row.viewsCount > 0 ||
    row.clonesCount > 0 ||
    row.forksCount > 0 ||
    row.starsCount > 0
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
          {filteredRows.map((repoData: RepoData) => <RepoTrafficTableRow key={repoData.id} repoData={repoData} />)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RepoTrafficTable
