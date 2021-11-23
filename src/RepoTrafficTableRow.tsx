import { TableCell, TableRow } from '@mui/material'
import { RepoData } from './types'

export type RepoTrafficTableRowProps = {
  repoData: RepoData
}

const RepoTrafficTableRow: React.FC<RepoTrafficTableRowProps> = ({ repoData }) => {
  return (
    <TableRow>
      <TableCell>{repoData.repo.name}</TableCell>
      <TableCell>{repoData.views.count}</TableCell>
      <TableCell>{repoData.views.uniques}</TableCell>
      <TableCell>{repoData.clones.count}</TableCell>
      <TableCell>{repoData.clones.uniques}</TableCell>
      <TableCell>{repoData.repo.forks_count}</TableCell>
      <TableCell>{repoData.repo.stargazers_count}</TableCell>
    </TableRow>
  )
}

export default RepoTrafficTableRow
