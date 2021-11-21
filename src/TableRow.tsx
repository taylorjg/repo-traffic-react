import { Item } from './types'

export type TableRowProps = {
  item: Item
}

const TableRow: React.FC<TableRowProps> = ({ item }) => {
  return (
    <tr>
      <td>{item.repo.name}</td>
      <td>{item.views.count}</td>
      <td>{item.views.unique}</td>
      <td>{item.clones.count}</td>
      <td>{item.clones.unique}</td>
      <td>{item.repo.forks_count}</td>
      <td>{item.repo.stargazers_count}</td>
    </tr>
  )
}

export default TableRow
