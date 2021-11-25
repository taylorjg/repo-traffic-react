import { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import RepoTrafficTableRow from './RepoTrafficTableRow'
import { RepoData } from './types'

export type RepoTrafficTableProps = {
  rows: RepoData[]
}

type SortDirection = 'asc' | 'desc'

const oppositeSortDirection = (sortDirection: SortDirection): SortDirection =>
  sortDirection === 'asc' ? 'desc' : 'asc'

type HeadCell = {
  id: keyof RepoData,
  label: string,
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name' },
  { id: 'viewsCount', label: 'Views Count' },
  { id: 'viewsUniques', label: 'Views Uniques' },
  { id: 'clonesCount', label: 'Clones Count' },
  { id: 'clonesUniques', label: 'Clones Uniques' },
  { id: 'forksCount', label: 'Forks' },
  { id: 'starsCount', label: 'Stars' }
]

// Trailing comma after the type parameter is required so that the compiler
// doesn't think this is JSX opening element tag.
const descendingComparator = <T,>(a: T, b: T, sortBy: keyof T) => {
  if (b[sortBy] < a[sortBy]) {
    return -1
  }
  if (b[sortBy] > a[sortBy]) {
    return 1
  }
  return 0
}

const getComparator = <Key extends keyof any>(sortDirection: SortDirection, sortBy: Key):
  (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number => {
  return sortDirection === 'desc'
    ? (a, b) => descendingComparator(a, b, sortBy)
    : (a, b) => -descendingComparator(a, b, sortBy)
}

const RepoTrafficTable: React.FC<RepoTrafficTableProps> = ({ rows }) => {

  const [sortBy, setSortBy] = useState<keyof RepoData>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const createSortHandler =
    (property: keyof RepoData) => (_event: React.MouseEvent<unknown>) => {
      if (property === sortBy) {
        setSortDirection(oppositeSortDirection(sortDirection))
      } else {
        setSortDirection('asc')
      }
      setSortBy(property)
    }

  const filterRows = (rows: RepoData[]): RepoData[] => {
    return rows.filter(row => (
      row.viewsCount > 0 ||
      row.clonesCount > 0 ||
      row.forksCount > 0 ||
      row.starsCount > 0
    ))
  }

  const sortRows = (rows: RepoData[]): RepoData[] => {
    return rows.slice().sort(getComparator(sortDirection, sortBy))
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headCells.map(headCell => (
              <TableCell key={headCell.id}>
                <TableSortLabel
                  active={sortBy === headCell.id}
                  direction={sortDirection}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortRows(filterRows(rows)).map((repoData: RepoData) => (
            <RepoTrafficTableRow key={repoData.id} repoData={repoData} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RepoTrafficTable
