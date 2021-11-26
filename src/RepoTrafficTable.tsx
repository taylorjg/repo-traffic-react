import { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import RepoTrafficTableRow from './RepoTrafficTableRow'
import { RepoData } from './types'

export type RepoTrafficTableProps = {
  rows: RepoData[]
}

type SortDirection = 'asc' | 'desc'

const oppositeSortDirection = (sortDirection: SortDirection): SortDirection => {
  switch (sortDirection) {
    case 'asc': return 'desc'
    case 'desc': return 'asc'
  }
}

type HeadCell = {
  property: keyof RepoData,
  label: string,
  initialSortDirection: SortDirection
}

const headCells: HeadCell[] = [
  { property: 'name', label: 'Name', initialSortDirection: 'asc' },
  { property: 'language', label: 'Language', initialSortDirection: 'asc' },
  { property: 'viewsCount', label: 'Total Views', initialSortDirection: 'desc' },
  { property: 'viewsUniques', label: 'Unique Viewers', initialSortDirection: 'desc' },
  { property: 'clonesCount', label: 'Total Clones', initialSortDirection: 'desc' },
  { property: 'clonesUniques', label: 'Unique Cloners', initialSortDirection: 'desc' },
  { property: 'forksCount', label: 'Forks', initialSortDirection: 'desc' },
  { property: 'starsCount', label: 'Stars', initialSortDirection: 'desc' }
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

const getComparator = <T, Key extends keyof T>(sortDirection: SortDirection, sortBy: Key):
  (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number => {
  return sortDirection === 'desc'
    ? (a, b) => descendingComparator(a, b, sortBy)
    : (a, b) => -descendingComparator(a, b, sortBy)
}

const RepoTrafficTable: React.FC<RepoTrafficTableProps> = ({ rows }) => {

  const [sortBy, setSortBy] = useState<keyof RepoData>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const createSortHandler =
    (headCell: HeadCell) => (_event: React.MouseEvent<unknown>) => {
      if (headCell.property === sortBy) {
        setSortDirection(oppositeSortDirection(sortDirection))
      } else {
        setSortDirection(headCell.initialSortDirection)
      }
      setSortBy(headCell.property)
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
              <TableCell key={headCell.property}>
                <TableSortLabel
                  active={sortBy === headCell.property}
                  direction={sortDirection}
                  onClick={createSortHandler(headCell)}
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
