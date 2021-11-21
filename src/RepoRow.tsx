import { TableCell, TableRow } from '@mui/material'
import { Item } from './types'

export type RepoRowProps = {
  item: Item
}

const RepoRow: React.FC<RepoRowProps> = ({ item }) => {
  return (
    <TableRow>
      <TableCell>{item.repo.name}</TableCell>
      <TableCell>{item.views.count}</TableCell>
      <TableCell>{item.views.unique}</TableCell>
      <TableCell>{item.clones.count}</TableCell>
      <TableCell>{item.clones.unique}</TableCell>
      <TableCell>{item.repo.forks_count}</TableCell>
      <TableCell>{item.repo.stargazers_count}</TableCell>
    </TableRow>
  )
}

export default RepoRow
