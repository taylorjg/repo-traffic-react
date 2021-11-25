import { TableCell, TableRow } from '@mui/material'
import { RepoData } from './types'

export type RepoTrafficTableRowProps = {
  repoData: RepoData
}

const RepoTrafficTableRow: React.FC<RepoTrafficTableRowProps> = ({ repoData }) => {
  return (
    <TableRow>
      <TableCell><a href={repoData.htmlUrl}>{repoData.name}</a></TableCell>
      <TableCell>{repoData.language}</TableCell>
      <TableCell>{repoData.viewsCount}</TableCell>
      <TableCell>{repoData.viewsUniques}</TableCell>
      <TableCell>{repoData.clonesCount}</TableCell>
      <TableCell>{repoData.clonesUniques}</TableCell>
      <TableCell>{repoData.forksCount}</TableCell>
      <TableCell>{repoData.starsCount}</TableCell>
    </TableRow>
  )
}

export default RepoTrafficTableRow
